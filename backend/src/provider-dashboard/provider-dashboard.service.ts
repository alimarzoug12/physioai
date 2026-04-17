// src/provider-dashboard/provider-dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProviderDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    // Get the doctor record for this user
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      include: { user: true, center: true },
    });

    if (!doctor) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86_400_000);
    const yesterday = new Date(today.getTime() - 86_400_000);

    // ── Today's sessions ───────────────────────────────────────
    const todayBookings = await this.prisma.booking.findMany({
      where: {
        doctorId: doctor.id,
        slot: { date: { gte: today, lt: tomorrow } },
        status: { in: ['CONFIRMED', 'PENDING', 'COMPLETED'] },
      },
      include: {
        patient: true,
        slot: true,
      },
      orderBy: { slot: { startTime: 'asc' } },
    });

    // Yesterday's session count for % change
    const yesterdayCount = await this.prisma.booking.count({
      where: {
        doctorId: doctor.id,
        slot: { date: { gte: yesterday, lt: today } },
        status: { in: ['CONFIRMED', 'PENDING', 'COMPLETED'] },
      },
    });

    const todayCount = todayBookings.length;
    const sessionChange = yesterdayCount > 0
      ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100)
      : 0;

    // ── Today's earnings ───────────────────────────────────────
    const todayEarnings = todayBookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum) => sum + doctor.pricePerSession, 0);

    const yesterdayEarnings = await this.prisma.booking.count({
      where: {
        doctorId: doctor.id,
        slot: { date: { gte: yesterday, lt: today } },
        status: 'COMPLETED',
      },
    }) * doctor.pricePerSession;

    const earningsChange = yesterdayEarnings > 0
      ? Math.round(((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100)
      : 0;

    // ── Weekly earnings chart (last 7 days) ────────────────────
    const weeklyData = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const dayStart = new Date(today.getTime() - (6 - i) * 86_400_000);
        const dayEnd   = new Date(dayStart.getTime() + 86_400_000);
        const count    = await this.prisma.booking.count({
          where: {
            doctorId: doctor.id,
            slot: { date: { gte: dayStart, lt: dayEnd } },
            status: 'COMPLETED',
          },
        });
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return {
          day:      days[dayStart.getDay()],
          earnings: count * doctor.pricePerSession,
        };
      })
    );

    // ── Weekly totals ──────────────────────────────────────────
    const weekStart = new Date(today.getTime() - 7 * 86_400_000);
    const weeklyBookings = await this.prisma.booking.findMany({
      where: {
        doctorId: doctor.id,
        slot: { date: { gte: weekStart } },
      },
      include: { slot: true },
    });

    const weeklyCompleted  = weeklyBookings.filter(b => b.status === 'COMPLETED');
    const weeklyTotal      = weeklyCompleted.length * doctor.pricePerSession;
    const homeVisits       = weeklyCompleted.filter(b => b.sessionType === 'HOME_VISIT');
    const clinicSessions   = weeklyCompleted.filter(b => b.sessionType === 'CLINIC');
    const homeEarnings     = homeVisits.length   * doctor.pricePerSession;
    const clinicEarnings   = clinicSessions.length * doctor.pricePerSession;

    // ── Practice analytics ─────────────────────────────────────
    const allPatientIds = await this.prisma.booking.findMany({
      where: { doctorId: doctor.id },
      select: { patientId: true },
      distinct: ['patientId'],
    });
    const totalPatients = allPatientIds.length;

    const totalBookings    = await this.prisma.booking.count({ where: { doctorId: doctor.id } });
    const completedAll     = await this.prisma.booking.count({ where: { doctorId: doctor.id, status: 'COMPLETED' } });
    const successRate      = totalBookings > 0 ? Math.round((completedAll / totalBookings) * 100) : 0;

    // ── Appointments (today, formatted) ───────────────────────
    const appointments = todayBookings.map(b => ({
      id:           b.id,
      patientName:  b.patient.fullName,
      patientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.patient.fullName)}&background=3b82f6&color=fff&size=64`,
      treatment:    b.notes ?? 'Physiotherapy Session',
      time:         b.slot.startTime,
      sessionType:  b.sessionType,
      status:       b.status,
    }));

    // ── Recent messages (last 5 bookings with notes) ───────────
    const recentMessages = await this.prisma.booking.findMany({
      where: {
        doctorId: doctor.id,
        notes:    { not: null },
      },
      include: { patient: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      doctor: {
        id:         doctor.id,
        fullName:   doctor.user.fullName,
        specialty:  doctor.specialties[0] ?? 'Physiotherapist',
        rating:     doctor.rating,
        experience: this.getExp(doctor.bio),
        center:     doctor.center.name,
        avatarUrl:  `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user.fullName)}&background=3b82f6&color=fff&size=128`,
      },
      stats: {
        todaySessions:  todayCount,
        sessionChange,
        todayEarnings,
        earningsChange,
        currency: 'QAR',
      },
      weeklyChart: weeklyData,
      weekly: {
        totalEarnings:    weeklyTotal,
        sessionsCompleted: weeklyCompleted.length,
        homeEarnings,
        clinicEarnings,
        homePercent:   weeklyCompleted.length > 0 ? Math.round((homeVisits.length   / weeklyCompleted.length) * 100) : 0,
        clinicPercent: weeklyCompleted.length > 0 ? Math.round((clinicSessions.length / weeklyCompleted.length) * 100) : 0,
      },
      analytics: {
        totalPatients,
        successRate,
        patientSatisfaction: doctor.rating * 20, // convert 0-5 to 0-100
        bookingCompletion: totalBookings > 0
          ? Math.round(((completedAll + weeklyBookings.filter(b => b.status === 'CONFIRMED').length) / totalBookings) * 100)
          : 0,
      },
      appointments,
      recentMessages: recentMessages.map(b => ({
        id:           b.id,
        patientName:  b.patient.fullName,
        patientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.patient.fullName)}&background=6b7280&color=fff&size=64`,
        message:      b.notes ?? '',
        time:         this.timeAgo(b.createdAt),
        tag:          b.sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic Session',
      })),
    };
  }

  private getExp(bio?: string | null): string {
    const match = (bio ?? '').match(/(\d+)\s+years?/i);
    return match ? `${match[1]} years exp.` : '5+ years exp.';
  }

  private timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 60)  return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? 's' : ''} ago`;
  }
}