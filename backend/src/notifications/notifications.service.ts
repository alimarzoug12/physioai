import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getPatientNotifications(userId: string) {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 86400000);

    // ── All bookings ───────────────────────────────────────
    const allBookings = await this.prisma.booking.findMany({
      where: { patientId: userId },
      include: {
        slot: true,
        doctor: { include: { user: true, center: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalSessions     = allBookings.length;
    const completedSessions = allBookings.filter(b => b.status === 'COMPLETED').length;
    const upcomingBookings  = allBookings.filter(b =>
      b.status === 'PENDING' || b.status === 'CONFIRMED'
    );

    // ── Next session ───────────────────────────────────────
    const nextSession = upcomingBookings
      .sort((a, b) => new Date(a.slot.date).getTime() - new Date(b.slot.date).getTime())[0];

    // ── This week's bookings ───────────────────────────────
    const weekBookings = allBookings.filter(b =>
      new Date(b.createdAt) >= weekAgo
    );
    const weekCompleted = weekBookings.filter(b => b.status === 'COMPLETED').length;
    const weekAttended  = weekCompleted;

    // ── Health insight ─────────────────────────────────────
    const healthInsight = await this.prisma.healthInsight.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // ── Reminders ──────────────────────────────────────────
    const reminders = await this.prisma.reminder.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    // ── Recovery goals (calculated) ────────────────────────
    const recoveryRate = totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;

    const streakDays = completedSessions * 3; // approximate

    // ── Today's updates ────────────────────────────────────
    const todaysUpdates: any[] = [];

    // Next session notification
    if (nextSession) {
      const sessionDate = new Date(nextSession.slot.date);
      const isToday = sessionDate.toDateString() === today.toDateString();
      const isTomorrow = sessionDate.toDateString() ===
        new Date(today.getTime() + 86400000).toDateString();

      todaysUpdates.push({
        type: 'SESSION_REMINDER',
        title: 'Session Reminder',
        message: `Your physiotherapy session with Dr. ${nextSession.doctor.user.fullName} is scheduled for ${nextSession.slot.startTime} ${
          isToday ? 'today' : isTomorrow ? 'tomorrow' : `on ${sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        } at ${nextSession.doctor.center.name}.`,
        time: isToday ? '2 hours' : isTomorrow ? 'Tomorrow' : sessionDate.toLocaleDateString(),
        isNew: true,
        doctorName: nextSession.doctor.user.fullName,
        location: nextSession.doctor.center.name,
        sessionTime: nextSession.slot.startTime,
      });
    }

    // Achievement notification
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

    // Exercise reminder
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
      // ── Health journey card ──────────────────────────────
      healthJourney: {
        recoveryRate,
        weeksInTreatment: Math.ceil(totalSessions / 2),
        completedSessions,
        totalSessions,
        upcomingSessions: upcomingBookings.length,
        streakDays,
        improvement: recoveryRate > 0 ? `+${Math.min(recoveryRate, 30)}%` : '0%',
      },

      // ── Today's updates ──────────────────────────────────
      todaysUpdates,

      // ── This week's progress ─────────────────────────────
      weekProgress: {
        exerciseCompliance: healthInsight
          ? Math.round((healthInsight.exerciseSessions / Math.max(healthInsight.totalSessions, 1)) * 100)
          : 90,
        painReduction: healthInsight?.painLevel != null
          ? Math.round((1 - healthInsight.painLevel / 10) * 100)
          : 60,
        sessionsAttended: weekAttended,
        totalWeekSessions: Math.max(weekAttended, 2),
        exerciseMinutes: (healthInsight?.exerciseSessions ?? 5) * 27,
        targetMinutes: 150,
        sleepQuality: healthInsight?.sleepQuality ?? 4,
      },

      // ── Upcoming reminders ───────────────────────────────
      reminders: reminders.map(r => ({
        id:      r.id,
        title:   r.title,
        message: r.message,
        type:    r.type,
        time:    r.time,
      })),

      // ── Recovery goals ───────────────────────────────────
      recoveryGoals: [
        {
          label:     'Return to Normal Activities',
          sub:       recoveryRate >= 75 ? 'Almost there!' : `${100 - recoveryRate}% remaining`,
          pct:       `${Math.min(recoveryRate, 100)}%`,
          color:     'bg-gradient-to-r from-purple-500 to-purple-600',
          textColor: 'text-purple-500',
        },
        {
          label:     'Pain-Free Movement',
          sub:       healthInsight?.painLevel != null && healthInsight.painLevel <= 3
            ? 'Significant improvement!'
            : 'Keep working with your therapist',
          pct:       `${healthInsight?.painLevel != null
            ? Math.round((1 - healthInsight.painLevel / 10) * 100)
            : 60}%`,
          color:     'bg-gradient-to-r from-blue-500 to-blue-600',
          textColor: 'text-blue-600',
        },
        {
          label:     'Strength Building',
          sub:       completedSessions >= 5 ? 'Great progress!' : 'Focus area for next sessions',
          pct:       `${Math.min(completedSessions * 10, 80)}%`,
          color:     'bg-gradient-to-r from-orange-400 to-red-500',
          textColor: 'text-orange-500',
        },
      ],

      // ── Health insight ───────────────────────────────────
      healthInsight: healthInsight ? {
        heartRate:        healthInsight.heartRate,
        dailySteps:       healthInsight.dailySteps,
        exerciseSessions: healthInsight.exerciseSessions,
        totalSessions:    healthInsight.totalSessions,
        painLevel:        healthInsight.painLevel,
        sleepQuality:     healthInsight.sleepQuality,
      } : null,
    };
  }
}