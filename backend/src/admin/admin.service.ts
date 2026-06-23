import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  // ── Users ──────────────────────────────────────────────────────
  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, users] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, fullName: true, email: true,
          role: true, createdAt: true, emailVerified: true,
        },
      }),
    ]);
    return { data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async banUser(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: false },
    });
    return { success: true, message: 'User banned' };
  }

  // ── Doctors ────────────────────────────────────────────────────
  async getAllDoctors(page = 1, limit = 20, approved?: string) {
    const skip = (page - 1) * limit;
    const where = approved !== undefined ? { isAvailable: approved === 'true' } : {};

    const [total, doctors] = await Promise.all([
      this.prisma.doctor.count({ where }),
      this.prisma.doctor.findMany({
        where, skip, take: limit,
        orderBy: { rating: 'desc' },
        include: { user: true, center: true },
      }),
    ]);

    return {
      data: doctors.map(d => ({
        id: d.id,
        fullName: d.user.fullName,
        email: d.user.email,
        specialties: d.specialties,
        rating: d.rating,
        isAvailable: d.isAvailable,
        center: d.center?.name ?? '',
        createdAt: d.user.createdAt,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async approveDoctor(doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    await this.prisma.doctor.update({ where: { id: doctorId }, data: { isAvailable: true } });
    return { success: true, message: 'Doctor approved' };
  }

  async rejectDoctor(doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    await this.prisma.doctor.update({ where: { id: doctorId }, data: { isAvailable: false } });
    return { success: true, message: 'Doctor rejected' };
  }

  // ── Bookings ───────────────────────────────────────────────────
  async getAllBookings(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as any } : {};

    const [total, bookings] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { doctor: { include: { user: true } }, slot: true },
      }),
    ]);

    return {
      data: bookings.map(b => ({
        id: b.id,
        status: b.status,
        sessionType: b.sessionType,
        totalAmount: b.totalAmount ?? 0,
        createdAt: b.createdAt,
        patientId: b.patientId,
        doctorName: b.doctor.user.fullName,
        slotDate: b.slot?.date,
        slotTime: b.slot?.startTime,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Promo Codes ────────────────────────────────────────────────
  async getAllPromoCodes() {
    return this.prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createPromoCode(dto: {
    code: string;
    discountPercent: number;
    usageLimit?: number;
    expiresAt?: string;
  }) {
    return this.prisma.promoCode.create({
      data: {
        code: dto.code.toUpperCase(),
        discountPercent: dto.discountPercent,
        usageLimit: dto.usageLimit ?? null,
        usageCount: 0,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        isActive: true,
      },
    });
  }

  async deactivatePromoCode(promoId: string) {
    await this.prisma.promoCode.update({ where: { id: promoId }, data: { isActive: false } });
    return { success: true };
  }

  async deletePromoCode(promoId: string) {
    await this.prisma.promoCode.delete({ where: { id: promoId } });
    return { success: true };
  }

  // ── Revenue Analytics ──────────────────────────────────────────
  async getRevenueAnalytics() {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [totalRevenue, thisMonthRevenue, lastMonthRevenue, totalBookings, completedBookings, cancelledBookings, totalUsers, totalDoctors, revenueByMonth] =
      await Promise.all([
        this.prisma.booking.aggregate({ where: { status: 'COMPLETED' }, _sum: { totalAmount: true } }),
        this.prisma.booking.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: thisMonth } }, _sum: { totalAmount: true } }),
        this.prisma.booking.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: lastMonth, lte: lastMonthEnd } }, _sum: { totalAmount: true } }),
        this.prisma.booking.count(),
        this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
        this.prisma.booking.count({ where: { status: 'CANCELLED' } }),
        this.prisma.user.count(),
        this.prisma.doctor.count(),
        this.getMonthlyRevenue(6),
      ]);

    const thisM = thisMonthRevenue._sum.totalAmount ?? 0;
    const lastM = lastMonthRevenue._sum.totalAmount ?? 0;
    const growth = lastM > 0 ? Math.round(((thisM - lastM) / lastM) * 100) : 0;

    return {
      overview: {
        totalRevenue: totalRevenue._sum.totalAmount ?? 0,
        thisMonthRevenue: thisM,
        lastMonthRevenue: lastM,
        revenueGrowth: `${growth > 0 ? '+' : ''}${growth}%`,
        totalBookings,
        completedBookings,
        cancelledBookings,
        completionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0,
        totalUsers,
        totalDoctors,
      },
      revenueByMonth,
    };
  }

  private async getMonthlyRevenue(months: number): Promise<{ month: string; revenue: number; bookings: number }[]> {
    const results: { month: string; revenue: number; bookings: number }[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const [agg, count] = await Promise.all([
        this.prisma.booking.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: start, lte: end } }, _sum: { totalAmount: true } }),
        this.prisma.booking.count({ where: { createdAt: { gte: start, lte: end } } }),
      ]);

      results.push({
        month: `${start.toLocaleString('en-US', { month: 'short' })} ${start.getFullYear()}`,
        revenue: agg._sum.totalAmount ?? 0,
        bookings: count,
      });
    }

    return results;
  }

  // ── Dashboard (used by /admin/dashboard endpoint) ──────────────
  async getDashboardSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalRevenue, thisMonthRevenue, lastMonthRevenue,
      totalBookings, confirmedBookings, cancelledBookings,
      pendingBookings, completedBookings,
      totalDoctors, availableDoctors, avgDoctorRating,
      totalPatients, newPatientsThisMonth, avgSessionValue,
      totalUsers, todayBookings,
    ] = await Promise.all([
      this.prisma.booking.aggregate({ where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }, _sum: { totalAmount: true } }),
      this.prisma.booking.aggregate({ where: { status: { in: ['CONFIRMED', 'COMPLETED'] }, createdAt: { gte: startOfMonth } }, _sum: { totalAmount: true } }),
      this.prisma.booking.aggregate({ where: { status: { in: ['CONFIRMED', 'COMPLETED'] }, createdAt: { gte: startOfLastMonth, lt: startOfMonth } }, _sum: { totalAmount: true } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.booking.count({ where: { status: 'CANCELLED' } }),
      this.prisma.booking.count({ where: { status: 'PENDING' } }),
      this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
      this.prisma.doctor.count(),
      this.prisma.doctor.count({ where: { isAvailable: true } }),
      this.prisma.doctor.aggregate({ _avg: { rating: true } }),
      this.prisma.user.count({ where: { role: 'PATIENT' } }),
      this.prisma.user.count({ where: { role: 'PATIENT', createdAt: { gte: startOfMonth } } }),
      this.prisma.booking.aggregate({ where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }, _avg: { totalAmount: true } }),
      this.prisma.user.count(),
      this.prisma.booking.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    ]);

    const totalRev = totalRevenue._sum.totalAmount ?? 0;
    const thisMonthRev = thisMonthRevenue._sum.totalAmount ?? 0;
    const lastMonthRev = lastMonthRevenue._sum.totalAmount ?? 0;
    const revenueGrowth = lastMonthRev > 0
      ? ((thisMonthRev - lastMonthRev) / lastMonthRev) * 100
      : (thisMonthRev > 0 ? 100 : 0);

    return {
      revenue: {
        total: totalRev,
        thisMonth: thisMonthRev,
        growth: Math.round(revenueGrowth * 10) / 10,
        avgSessionValue: Math.round(avgSessionValue._avg.totalAmount ?? 0),
      },
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        pending: pendingBookings,
        completed: completedBookings,
        today: todayBookings,
        cancellationRate: totalBookings > 0 ? Math.round((cancelledBookings / totalBookings) * 1000) / 10 : 0,
      },
      doctors: {
        total: totalDoctors,
        available: availableDoctors,
        avgRating: Math.round((avgDoctorRating._avg.rating ?? 0) * 100) / 100,
      },
      patients: {
        total: totalPatients,
        newThisMonth: newPatientsThisMonth,
      },
      users: { total: totalUsers },
      generatedAt: new Date().toISOString(),
    };
  }

  // ── Recent Bookings ────────────────────────────────────────────
  async getRecentBookings() {
    const bookings = await this.prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: true,
        doctor: { include: { user: true } },
        slot: true,
      },
    });

    return bookings.map(b => ({
      patient: b.patient?.fullName ?? 'Unknown',
      doctor: b.doctor?.user?.fullName ?? 'Unknown',
      spec: b.doctor?.specialties?.[0] ?? 'General',
      time: b.slot ? new Date(b.slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + b.slot.startTime : '',
      amount: b.totalAmount ?? 0,
      status: b.status,
    }));
  }

  // ── Top Doctors ────────────────────────────────────────────────
  async getTopDoctors() {
    const doctors = await this.prisma.doctor.findMany({
      include: {
        user: true,
        bookings: { where: { status: { in: ['CONFIRMED', 'COMPLETED'] } } },
      },
      orderBy: { rating: 'desc' },
      take: 5,
    });

    return doctors.map(d => ({
      name: d.user.fullName,
      spec: d.specialties[0] ?? 'General',
      sessions: d.bookings.length,
      rating: d.rating ?? 0,
      revenue: d.bookings.reduce((sum, b) => sum + (b.totalAmount ?? 0), 0),
    })).sort((a, b) => b.revenue - a.revenue);
  }

  // ── Specialty Breakdown ────────────────────────────────────────
  async getSpecialtyBreakdown() {
    const bookings = await this.prisma.booking.findMany({
      where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
      include: { doctor: true },
    });

    const counts: Record<string, number> = {};
    bookings.forEach(b => {
      const spec = b.doctor?.specialties?.[0] ?? 'Other';
      counts[spec] = (counts[spec] ?? 0) + 1;
    });

    const total = bookings.length || 1;
    const colors = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'];

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count], i) => ({
        name,
        value: Math.round((count / total) * 100),
        color: colors[i % colors.length],
      }));
  }

  // ── Revenue Trend (12 months) ──────────────────────────────────
  async getRevenueTrend() {
    const now = new Date();
    const months: { m: string; rev: number; bk: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const [agg, count] = await Promise.all([
        this.prisma.booking.aggregate({
          where: { status: { in: ['CONFIRMED', 'COMPLETED'] }, createdAt: { gte: start, lt: end } },
          _sum: { totalAmount: true },
        }),
        this.prisma.booking.count({
          where: { status: { in: ['CONFIRMED', 'COMPLETED'] }, createdAt: { gte: start, lt: end } },
        }),
      ]);

      months.push({
        m: start.toLocaleDateString('en-US', { month: 'short' }),
        rev: agg._sum.totalAmount ?? 0,
        bk: count,
      });
    }

    return months;
  }

  // ── Booking Trend (7 days) ─────────────────────────────────────
  async getBookingTrend() {
    const now = new Date();
    const days: { m: string; c: number; x: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const dayBase = new Date(now);
      dayBase.setDate(dayBase.getDate() - i);
      const start = new Date(dayBase); start.setHours(0, 0, 0, 0);
      const end   = new Date(dayBase); end.setHours(23, 59, 59, 999);

      const [confirmed, cancelled] = await Promise.all([
        this.prisma.booking.count({ where: { status: 'CONFIRMED', createdAt: { gte: start, lte: end } } }),
        this.prisma.booking.count({ where: { status: 'CANCELLED', createdAt: { gte: start, lte: end } } }),
      ]);

      days.push({
        m: start.toLocaleDateString('en-US', { weekday: 'short' }),
        c: confirmed,
        x: cancelled,
      });
    }

    return days;
  }

  // ── Patient Stats ──────────────────────────────────────────────
  async getPatientStats() {
    const now = new Date();
    const startOfMonth     = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thirtyDaysAgo    = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalPatients, newThisMonth, newLastMonth, patientsWithBookings, activePatients30d, revenueAgg] =
      await Promise.all([
        this.prisma.user.count({ where: { role: 'PATIENT' } }),
        this.prisma.user.count({ where: { role: 'PATIENT', createdAt: { gte: startOfMonth } } }),
        this.prisma.user.count({ where: { role: 'PATIENT', createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
        this.prisma.booking.groupBy({ by: ['patientId'], _count: true }),
        this.prisma.booking.groupBy({ by: ['patientId'], where: { createdAt: { gte: thirtyDaysAgo } } }),
        this.prisma.booking.aggregate({ where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }, _sum: { totalAmount: true } }),
      ]);

    const growth = newLastMonth > 0
      ? ((newThisMonth - newLastMonth) / newLastMonth) * 100
      : (newThisMonth > 0 ? 100 : 0);

    const retainedPatients = patientsWithBookings.filter(p => p._count >= 2).length;
    const retentionRate    = totalPatients > 0 ? (retainedPatients / totalPatients) * 100 : 0;
    const avgSessions      = patientsWithBookings.length > 0
      ? patientsWithBookings.reduce((sum, p) => sum + p._count, 0) / patientsWithBookings.length
      : 0;
    const ltv       = totalPatients > 0 ? (revenueAgg._sum.totalAmount ?? 0) / totalPatients : 0;
    const churnRate = totalPatients > 0 ? ((totalPatients - activePatients30d.length) / totalPatients) * 100 : 0;

    return {
      total: totalPatients,
      newThisMonth,
      growth:        Math.round(growth        * 10) / 10,
      retentionRate: Math.round(retentionRate * 10) / 10,
      churnRate:     Math.round(churnRate     * 10) / 10,
      avgSessions:   Math.round(avgSessions   * 10) / 10,
      ltv:           Math.round(ltv),
    };
  }

  // ── AI Stats ───────────────────────────────────────────────────
  async getAiStats() {
    const [chatSessions, aiBookings, totalMessages, totalBookings] = await Promise.all([
      this.prisma.chatSession.count(),
      this.prisma.booking.count({ where: { bookedVia: 'AI_AGENT' } }),
      this.prisma.chatMessage.count(),
      this.prisma.booking.count(),
    ]);

    return {
      chatSessions,
      aiBookings,
      totalMessages,
      conversionRate:  chatSessions > 0 ? Math.round((aiBookings / chatSessions) * 1000) / 10 : 0,
      manualBookings:  totalBookings - aiBookings,
    };
  }
}