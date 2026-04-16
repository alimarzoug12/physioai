import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async getPatientSessions(userId: string) {

    // ── All bookings ───────────────────────────────────────
    const allBookings = await this.prisma.booking.findMany({
      where: { patientId: userId },
      include: {
        slot: true,
        doctor: {
          include: { user: true, center: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // ── Stats ──────────────────────────────────────────────
    const totalSessions     = allBookings.length;
    const completedSessions = allBookings.filter(b => b.status === 'COMPLETED').length;
    const upcomingSessions  = allBookings.filter(b =>
      b.status === 'PENDING' || b.status === 'CONFIRMED'
    ).length;
    const recoveryRate = totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;
    const weeksInTreatment = totalSessions > 0
      ? Math.ceil(totalSessions / 2)
      : 0;

    // ── Upcoming bookings ──────────────────────────────────
    const upcoming = allBookings
      .filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED')
      .map((b, index) => ({
        id:       b.id,
        num:      `#${totalSessions - index}`,
        status:   b.status,
        date:     b.slot.date,
        startTime: b.slot.startTime,
        endTime:  b.slot.endTime,
        sessionType: b.sessionType,
        notes:    b.notes,
        doctor: {
          fullName:   b.doctor.user.fullName,
          specialty:  b.doctor.specialties[0] || '',
          center:     b.doctor.center.name,
          rating:     b.doctor.rating,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.doctor.user.fullName)}&background=3b82f6&color=fff&size=128`,
        },
      }));

    // ── Completed bookings ─────────────────────────────────
    const completed = allBookings
      .filter(b => b.status === 'COMPLETED')
      .map((b, index) => ({
        id:          b.id,
        num:         `#${completedSessions - index}`,
        status:      b.status,
        date:        b.slot.date,
        startTime:   b.slot.startTime,
        sessionType: b.sessionType,
        notes:       b.notes,
        price:       `QAR ${b.doctor.pricePerSession}`,
        doctor: {
          fullName:  b.doctor.user.fullName,
          specialty: b.doctor.specialties[0] || '',
          center:    b.doctor.center.name,
          rating:    b.doctor.rating,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.doctor.user.fullName)}&background=3b82f6&color=fff&size=128`,
        },
      }));

    // ── Health insights (latest) ───────────────────────────
    const healthInsight = await this.prisma.healthInsight.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      stats: {
        totalSessions,
        completedSessions,
        upcomingSessions,
        recoveryRate,
        weeksInTreatment,
      },
      upcoming,
      completed,
      healthInsight: healthInsight ? {
        painLevel:    healthInsight.painLevel,
        sleepQuality: healthInsight.sleepQuality,
        exerciseSessions: healthInsight.exerciseSessions,
        totalExercises:   healthInsight.totalSessions,
      } : null,
    };
  }
}