// src/provider-dashboard/provider-dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProviderDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      include: { user: true, center: true },
    });
    if (!doctor) return null;

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayEnd   = new Date(todayStart.getTime() + 86_400_000);
    const yesterday  = new Date(todayStart.getTime() - 86_400_000);
    const weekAgo    = new Date(todayStart.getTime() - 7 * 86_400_000);

    // ── Today's bookings ───────────────────────────────────────
    const todayBookings = await this.prisma.booking.findMany({
      where: {
        doctorId: doctor.id,
        slot: { date: { gte: todayStart, lt: todayEnd } },
        status: { in: ['CONFIRMED', 'PENDING', 'COMPLETED'] },
      },
      include: { patient: { include: { wallet: true } }, slot: true },
      orderBy: { slot: { startTime: 'asc' } },
    });

    const yesterdayCount = await this.prisma.booking.count({
      where: { doctorId: doctor.id, slot: { date: { gte: yesterday, lt: todayStart } }, status: { in: ['CONFIRMED', 'PENDING', 'COMPLETED'] } },
    });
    const todayCount     = todayBookings.length;
    const sessionChange  = yesterdayCount > 0 ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100) : (todayCount > 0 ? 100 : 0);

    // ── Earnings ───────────────────────────────────────────────
    const todayCompleted    = todayBookings.filter(b => b.status === 'COMPLETED').length;
    const todayEarnings     = todayCompleted * doctor.pricePerSession;
    const yestCompleted     = await this.prisma.booking.count({ where: { doctorId: doctor.id, slot: { date: { gte: yesterday, lt: todayStart } }, status: 'COMPLETED' } });
    const yestEarnings      = yestCompleted * doctor.pricePerSession;
    const earningsChange    = yestEarnings > 0 ? Math.round(((todayEarnings - yestEarnings) / yestEarnings) * 100) : (todayEarnings > 0 ? 100 : 0);

    // ── Weekly chart (last 7 days) ─────────────────────────────
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyChart = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const ds = new Date(todayStart.getTime() - (6 - i) * 86_400_000);
        const de = new Date(ds.getTime() + 86_400_000);
        const n  = await this.prisma.booking.count({ where: { doctorId: doctor.id, slot: { date: { gte: ds, lt: de } }, status: 'COMPLETED' } });
        return { day: DAYS[ds.getDay()], earnings: n * doctor.pricePerSession };
      })
    );

    // ── Weekly totals ──────────────────────────────────────────
    const weeklyBookings = await this.prisma.booking.findMany({
      where: { doctorId: doctor.id, slot: { date: { gte: weekAgo } }, status: 'COMPLETED' },
      include: { slot: true },
    });
    const homeVisits     = weeklyBookings.filter(b => b.sessionType === 'HOME_VISIT');
    const clinicSessions = weeklyBookings.filter(b => b.sessionType === 'CLINIC');
    const weeklyTotal    = weeklyBookings.length * doctor.pricePerSession;
    const homeEarnings   = homeVisits.length   * doctor.pricePerSession;
    const clinicEarnings = clinicSessions.length * doctor.pricePerSession;

    // ── All-time analytics ─────────────────────────────────────
    const allBookings      = await this.prisma.booking.count({ where: { doctorId: doctor.id } });
    const allCompleted     = await this.prisma.booking.count({ where: { doctorId: doctor.id, status: 'COMPLETED' } });
    const uniquePatientIds = await this.prisma.booking.findMany({ where: { doctorId: doctor.id }, select: { patientId: true }, distinct: ['patientId'] });
    const totalPatients    = uniquePatientIds.length;
    const successRate      = allBookings > 0 ? Math.round((allCompleted / allBookings) * 100) : 0;

    // ── Patient list with wallet balances ──────────────────────
    const patientIds = uniquePatientIds.map(r => r.patientId);
    const patientRecords = await this.prisma.user.findMany({
      where:   { id: { in: patientIds } },
      include: {
        wallet: { include: { rewards: true } },
        bookings: { where: { doctorId: doctor.id }, orderBy: { createdAt: 'desc' }, take: 1 },
        healthProfile: true,
      },
    });

    const patientList = patientRecords.map(p => ({
      id:             p.id,
      fullName:       p.fullName,
      avatarUrl:      `https://ui-avatars.com/api/?name=${encodeURIComponent(p.fullName)}&background=6b7280&color=fff&size=64`,
      walletBalance:  p.wallet?.balance ?? 0,
      walletCurrency: p.wallet?.currency ?? 'QAR',
      rewardPoints:   p.wallet?.rewards?.points ?? 0,
      lastVisit:      p.bookings[0]?.createdAt ? this.timeAgo(p.bookings[0].createdAt) : 'No visits yet',
      condition:      this.getCondition(p.healthProfile),
      totalBookings:  p.bookings.length,
    })).sort((a, b) => b.walletBalance - a.walletBalance); // sort by wallet balance desc

    // ── Today's appointments ───────────────────────────────────
    const appointments = todayBookings.map(b => ({
      id:            b.id,
      patientName:   b.patient.fullName,
      patientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.patient.fullName)}&background=3b82f6&color=fff&size=64`,
      patientWallet: b.patient.wallet?.balance ?? 0,
      treatment:     b.notes ?? 'Physiotherapy Session',
      time:          b.slot.startTime,
      sessionType:   b.sessionType,
      status:        b.status,
    }));

    // ── Recent messages (last 5 bookings with notes) ───────────
    const recentMsgs = await this.prisma.booking.findMany({
      where:   { doctorId: doctor.id, notes: { not: null } },
      include: { patient: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      doctor: {
        id:        doctor.id,
        fullName:  doctor.user.fullName,
        specialty: doctor.specialties[0] ?? 'Physiotherapist',
        rating:    doctor.rating,
        experience: this.getExp(doctor.bio),
        center:    doctor.center.name,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user.fullName)}&background=3b82f6&color=fff&size=128`,
      },
      stats: {
        todaySessions: todayCount,
        sessionChange,
        todayEarnings,
        earningsChange,
        currency: 'QAR',
      },
      weeklyChart,
      weekly: {
        totalEarnings:     weeklyTotal,
        sessionsCompleted: weeklyBookings.length,
        homeEarnings,
        clinicEarnings,
        homePercent:   weeklyBookings.length > 0 ? Math.round((homeVisits.length   / weeklyBookings.length) * 100) : 0,
        clinicPercent: weeklyBookings.length > 0 ? Math.round((clinicSessions.length / weeklyBookings.length) * 100) : 0,
      },
      analytics: {
        totalPatients,
        successRate,
        patientSatisfaction: Math.round(doctor.rating * 20),
        bookingCompletion: allBookings > 0 ? Math.round((allCompleted / allBookings) * 100) : 0,
      },
      patientList,        // ← NEW: all patients with wallet balances
      appointments,
      recentMessages: recentMsgs.map(b => ({
        id:            b.id,
        patientName:   b.patient.fullName,
        patientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.patient.fullName)}&background=6b7280&color=fff&size=64`,
        message:       b.notes ?? '',
        time:          this.timeAgo(b.createdAt),
        tag:           b.sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic Session',
      })),
    };
  }

  private getExp(bio?: string | null): string {
    const m = (bio ?? '').match(/(\d+)\s+years?/i);
    return m ? `${m[1]} years exp.` : '5+ years exp.';
  }

  private getCondition(hp: any): string {
    if (!hp) return 'General Care';
    if (hp.backPain)     return 'Back Pain';
    if (hp.jointPain)    return 'Joint Pain';
    if (hp.sportsInjury) return 'Sports Injury';
    if (hp.neckIssues)   return 'Neck Issues';
    return 'General Care';
  }

  private timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 60)  return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? 's' : ''} ago`;
  }
}