import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export type NotificationType =
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_RESCHEDULED'
  | 'NEW_BOOKING'
  | 'PAYMENT_SUCCESS'
  | 'SESSION_REMINDER'
  | 'ACHIEVEMENT'
  | 'EXERCISE'
  | 'GENERAL';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // Gateway is set after init to avoid circular dependency
  private gateway: any = null;

  setGateway(gateway: any) {
    this.gateway = gateway;
  }

  constructor(private prisma: PrismaService) { }

  // ─────────────────────────────────────────────────────────────────
  // PUSH + PERSIST  (used by BookingsService after booking events)
  // ─────────────────────────────────────────────────────────────────

  async send(dto: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
  }) {
    // 1. Save to DB so it persists across sessions
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        data: dto.data ? JSON.stringify(dto.data) : null,
        isRead: false,
      },
    });

    // 2. Push via WebSocket if user is currently online
    if (this.gateway) {
      this.gateway.sendToUser(dto.userId, 'notification', {
        id: notification.id,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        data: dto.data,
        isRead: false,
        createdAt: notification.createdAt,
      });
    }

    this.logger.log(`Notification sent to ${dto.userId}: ${dto.type}`);
    return notification;
  }

  // ── Convenience methods ──────────────────────────────────────────

  async notifyBookingConfirmed(patientId: string, bookingId: string, doctorName: string, date: string) {
    return this.send({
      userId: patientId,
      type: 'BOOKING_CONFIRMED',
      title: '✅ Booking Confirmed',
      message: `Your session with Dr. ${doctorName} on ${date} is confirmed.`,
      data: { bookingId },
    });
  }

  async notifyBookingCancelled(patientId: string, bookingId: string, refundAmount: number) {
    return this.send({
      userId: patientId,
      type: 'BOOKING_CANCELLED',
      title: '❌ Booking Cancelled',
      message: refundAmount > 0
        ? `Your booking was cancelled. ${refundAmount} QAR will be refunded.`
        : 'Your booking was cancelled. No refund applies.',
      data: { bookingId, refundAmount },
    });
  }

  async notifyBookingRescheduled(patientId: string, bookingId: string, newDate: string, newTime: string) {
    return this.send({
      userId: patientId,
      type: 'BOOKING_RESCHEDULED',
      title: '📅 Booking Rescheduled',
      message: `Your session was rescheduled to ${newDate} at ${newTime}.`,
      data: { bookingId, newDate, newTime },
    });
  }

  async notifyDoctorNewBooking(doctorUserId: string, bookingId: string, patientName: string, date: string) {
    return this.send({
      userId: doctorUserId,
      type: 'NEW_BOOKING',
      title: '🆕 New Booking',
      message: `${patientName} booked a session on ${date}.`,
      data: { bookingId },
    });
  }

  async notifyPaymentSuccess(patientId: string, bookingId: string, amount: number) {
    return this.send({
      userId: patientId,
      type: 'PAYMENT_SUCCESS',
      title: '💳 Payment Successful',
      message: `Payment of ${amount} QAR was processed successfully.`,
      data: { bookingId, amount },
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // GET PERSISTED NOTIFICATIONS  (for the bell dropdown)
  // ─────────────────────────────────────────────────────────────────

  async getPersistedNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: rows.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data ? JSON.parse(n.data as string) : null,
        isRead: n.isRead,
        createdAt: n.createdAt,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  async markAsRead(notificationId: string, userId: string) {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }

  // ─────────────────────────────────────────────────────────────────
  // YOUR EXISTING METHOD — kept exactly as-is
  // ─────────────────────────────────────────────────────────────────

  async getPatientNotifications(userId: string) {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 86400000);

    const allBookings = await this.prisma.booking.findMany({
      where: { patientId: userId },
      include: {
        slot: true,
        doctor: { include: { user: true, center: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalSessions = allBookings.length;
    const completedSessions = allBookings.filter(b => b.status === 'COMPLETED').length;
    const upcomingBookings = allBookings.filter(b =>
      b.status === 'PENDING' || b.status === 'CONFIRMED',
    );

    const nextSession = upcomingBookings
      .sort((a, b) => new Date(a.slot.date).getTime() - new Date(b.slot.date).getTime())[0];

    const weekBookings = allBookings.filter(b => new Date(b.createdAt) >= weekAgo);
    const weekCompleted = weekBookings.filter(b => b.status === 'COMPLETED').length;

    const healthInsight = await this.prisma.healthInsight.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const reminders = await this.prisma.reminder.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    const recoveryRate = totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;
    const streakDays = completedSessions * 3;

    const todaysUpdates: any[] = [];

    if (nextSession) {
      const sessionDate = new Date(nextSession.slot.date);
      const isToday = sessionDate.toDateString() === today.toDateString();
      const isTomorrow = sessionDate.toDateString() ===
        new Date(today.getTime() + 86400000).toDateString();

      todaysUpdates.push({
        type: 'SESSION_REMINDER',
        title: 'Session Reminder',
        message: `Your physiotherapy session with Dr. ${nextSession.doctor.user.fullName} is scheduled for ${nextSession.slot.startTime} ${isToday ? 'today' : isTomorrow ? 'tomorrow'
            : `on ${sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
          } at ${nextSession.doctor.center.name}.`,
        time: isToday ? '2 hours' : isTomorrow ? 'Tomorrow' : sessionDate.toLocaleDateString(),
        isNew: true,
        doctorName: nextSession.doctor.user.fullName,
        location: nextSession.doctor.center.name,
        sessionTime: nextSession.slot.startTime,
      });
    }

    if (completedSessions >= 2) {
      todaysUpdates.push({
        type: 'ACHIEVEMENT',
        title: 'Achievement Unlocked!',
        message: `🎉 Congratulations! You've completed ${completedSessions} sessions. Your recovery rate is ${recoveryRate}%!`,
        time: '1 hour ago',
        isNew: true,
        recoveryRate,
        completedSessions,
      });
    }

    todaysUpdates.push({
      type: 'EXERCISE',
      title: 'Daily Exercise Time',
      message: 'Time for your prescribed stretches! Complete your routine to maintain progress.',
      time: '30 min ago',
      isNew: false,
      exercises: [
        { name: 'Cat-Cow Stretch', duration: '2 min', done: true },
        { name: 'Pelvic Tilts', duration: '5 min', done: false },
        { name: 'Knee-to-Chest', duration: '8 min', done: false },
      ],
    });

    return {
      healthJourney: {
        recoveryRate,
        weeksInTreatment: Math.ceil(totalSessions / 2),
        completedSessions,
        totalSessions,
        upcomingSessions: upcomingBookings.length,
        streakDays,
        improvement: recoveryRate > 0 ? `+${Math.min(recoveryRate, 30)}%` : '0%',
      },
      todaysUpdates,
      weekProgress: {
        exerciseCompliance: healthInsight
          ? Math.round((healthInsight.exerciseSessions / Math.max(healthInsight.totalSessions, 1)) * 100)
          : 90,
        painReduction: healthInsight?.painLevel != null
          ? Math.round((1 - healthInsight.painLevel / 10) * 100)
          : 60,
        sessionsAttended: weekCompleted,
        totalWeekSessions: Math.max(weekCompleted, 2),
        exerciseMinutes: (healthInsight?.exerciseSessions ?? 5) * 27,
        targetMinutes: 150,
        sleepQuality: healthInsight?.sleepQuality ?? 4,
      },
      reminders: reminders.map(r => ({
        id: r.id,
        title: r.title,
        message: r.message,
        type: r.type,
        time: r.time,
      })),
      recoveryGoals: [
        {
          label: 'Return to Normal Activities',
          sub: recoveryRate >= 75 ? 'Almost there!' : `${100 - recoveryRate}% remaining`,
          pct: `${Math.min(recoveryRate, 100)}%`,
          color: 'bg-gradient-to-r from-purple-500 to-purple-600',
          textColor: 'text-purple-500',
        },
        {
          label: 'Pain-Free Movement',
          sub: healthInsight?.painLevel != null && healthInsight.painLevel <= 3
            ? 'Significant improvement!'
            : 'Keep working with your therapist',
          pct: `${healthInsight?.painLevel != null
            ? Math.round((1 - healthInsight.painLevel / 10) * 100)
            : 60}%`,
          color: 'bg-gradient-to-r from-blue-500 to-blue-600',
          textColor: 'text-blue-600',
        },
        {
          label: 'Strength Building',
          sub: completedSessions >= 5 ? 'Great progress!' : 'Focus area for next sessions',
          pct: `${Math.min(completedSessions * 10, 80)}%`,
          color: 'bg-gradient-to-r from-orange-400 to-red-500',
          textColor: 'text-orange-500',
        },
      ],
      healthInsight: healthInsight ? {
        heartRate: healthInsight.heartRate,
        dailySteps: healthInsight.dailySteps,
        exerciseSessions: healthInsight.exerciseSessions,
        totalSessions: healthInsight.totalSessions,
        painLevel: healthInsight.painLevel,
        sleepQuality: healthInsight.sleepQuality,
      } : null,
    };
  }
}