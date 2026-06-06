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
    const where = approved !== undefined
      ? { isAvailable: approved === 'true' }
      : {};

    const [total, doctors] = await Promise.all([
      this.prisma.doctor.count({ where }),
      this.prisma.doctor.findMany({
        where,
        skip,
        take: limit,
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
    await this.prisma.doctor.update({
      where: { id: doctorId },
      data: { isAvailable: true },
    });
    return { success: true, message: 'Doctor approved' };
  }

  async rejectDoctor(doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    await this.prisma.doctor.update({
      where: { id: doctorId },
      data: { isAvailable: false },
    });
    return { success: true, message: 'Doctor rejected' };
  }

  // ── Bookings ───────────────────────────────────────────────────
  async getAllBookings(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as any } : {};

    const [total, bookings] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          doctor: { include: { user: true } },
          slot: true,
        },
      }),
    ]);

    return {
      data: bookings.map(b => ({
        id: b.id,
        status: b.status,
        sessionType: b.sessionType,
        totalAmount: b.totalAmount,
        createdAt: b.createdAt,
        patientId: b.patientId,
        doctorName: b.doctor.user.fullName,
        slotDate: b.slot.date,
        slotTime: b.slot.startTime,
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
    discountPercent: number;    // ✅ matches schema
    usageLimit?: number;    // ✅ matches schema (optional in schema)
    expiresAt?: string;
  }) {
    const promo = await this.prisma.promoCode.create({
      data: {
        code: dto.code.toUpperCase(),
        discountPercent: dto.discountPercent,  // ✅
        usageLimit: dto.usageLimit ?? null, // ✅
        usageCount: 0,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        isActive: true,
      },
    });
    return promo;
  }

  async deactivatePromoCode(promoId: string) {
    await this.prisma.promoCode.update({
      where: { id: promoId },
      data: { isActive: false },
    });
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

    const [
      totalRevenue,
      thisMonthRevenue,
      lastMonthRevenue,
      totalBookings,
      completedBookings,
      cancelledBookings,
      totalUsers,
      totalDoctors,
      revenueByMonth,
    ] = await Promise.all([
      // Total revenue ever
      this.prisma.booking.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
      // This month revenue
      this.prisma.booking.aggregate({
        where: { status: 'COMPLETED', createdAt: { gte: thisMonth } },
        _sum: { totalAmount: true },
      }),
      // Last month revenue
      this.prisma.booking.aggregate({
        where: { status: 'COMPLETED', createdAt: { gte: lastMonth, lte: lastMonthEnd } },
        _sum: { totalAmount: true },
      }),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
      this.prisma.booking.count({ where: { status: 'CANCELLED' } }),
      this.prisma.user.count(),
      this.prisma.doctor.count(),
      // Last 6 months revenue breakdown
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
        completionRate: totalBookings > 0
          ? Math.round((completedBookings / totalBookings) * 100)
          : 0,
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
    const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    const [agg, count] = await Promise.all([
      this.prisma.booking.aggregate({
        where: { status: 'COMPLETED', createdAt: { gte: start, lte: end } },
        _sum:  { totalAmount: true },
      }),
      this.prisma.booking.count({
        where: { createdAt: { gte: start, lte: end } },
      }),
    ]);

    results.push({
      month:    `${start.toLocaleString('en-US', { month: 'short' })} ${start.getFullYear()}`,
      revenue:  agg._sum.totalAmount ?? 0,
      bookings: count,
    });
  }

  return results;
}

  // ── Dashboard Summary ──────────────────────────────────────────
  async getDashboardSummary() {
    const [
      totalUsers,
      totalDoctors,
      pendingDoctors,
      totalBookings,
      todayBookings,
      revenue,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.doctor.count({ where: { isAvailable: true } }),
      this.prisma.doctor.count({ where: { isAvailable: false } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      this.prisma.booking.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalUsers,
      totalDoctors,
      pendingDoctors,
      totalBookings,
      todayBookings,
      totalRevenue: revenue._sum.totalAmount ?? 0,
    };
  }
}