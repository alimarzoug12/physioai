// src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // ← rename from getDashboardData to getPatientDashboard
  async getPatientDashboard(userId: string) {
    const totalSessions = await this.prisma.booking.count({
      where: { patientId: userId },
    });

    const completedSessions = await this.prisma.booking.count({
      where: { patientId: userId, status: 'COMPLETED' },
    });

    const bookings = await this.prisma.booking.findMany({
      where: {
        patientId: userId,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      include: {
        doctor: { include: { user: true, center: true } },
        slot: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentActivity = await this.prisma.booking.findMany({
      where: { patientId: userId },
      include: {
        doctor: { include: { user: true } },
        slot: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const formattedBookings = bookings.map(b => ({
      id: b.id,
      status: b.status,
      sessionType: b.sessionType,
      notes: b.notes,
      createdAt: b.createdAt,
      slot: {
        date: b.slot.date,
        startTime: b.slot.startTime,
        endTime: b.slot.endTime,
      },
      doctor: {
        id: b.doctor.id,
        fullName: b.doctor.user.fullName,
        specialties: b.doctor.specialties,
        rating: b.doctor.rating,
        center: b.doctor.center.name,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.doctor.user.fullName)}&background=3b82f6&color=fff&size=128`,
      },
    }));

    const formattedActivity = recentActivity.map(b => ({
      id: b.id,
      status: b.status,
      createdAt: b.createdAt,
      doctorName: b.doctor.user.fullName,
      specialty: b.doctor.specialties[0] || '',
      slot: {
        date: b.slot.date,
        startTime: b.slot.startTime,
      },
    }));

    return {
      stats: {
        totalSessions,
        completedSessions,
        pendingSessions: totalSessions - completedSessions,
        recoveryRate: completedSessions > 0
          ? Math.round((completedSessions / totalSessions) * 100)
          : 0,
      },
      bookings: formattedBookings,
      recentActivity: formattedActivity,
    };
  }
}