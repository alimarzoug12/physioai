import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }
    
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

        const healthInsight = await this.prisma.healthInsight.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        // ── Reminders ─────────────────────────────────────────────
        const reminders = await this.prisma.reminder.findMany({
            where: { userId, isActive: true },
            orderBy: { createdAt: 'asc' },
        });

        // ── Progress (based on bookings) ──────────────────────────
        const progress = {
            painReduction: completedSessions > 0 ? Math.min(completedSessions * 20, 90) : 0,
            mobilityImprovement: completedSessions > 0 ? Math.min(completedSessions * 15, 75) : 0,
            exerciseCompliance: healthInsight?.exerciseSessions && healthInsight?.totalSessions
                ? Math.round((healthInsight.exerciseSessions / healthInsight.totalSessions) * 100)
                : 0,
            weeksInTreatment: totalSessions > 0 ? Math.ceil(totalSessions / 2) : 0,
        };

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
            healthInsight: healthInsight ? {
                heartRate: healthInsight.heartRate,
                dailySteps: healthInsight.dailySteps,
                exerciseSessions: healthInsight.exerciseSessions,
                totalSessions: healthInsight.totalSessions,
                painLevel: healthInsight.painLevel,
                sleepQuality: healthInsight.sleepQuality,
            } : null,
            reminders: reminders.map(r => ({
                id: r.id,
                title: r.title,
                message: r.message,
                type: r.type,
                time: r.time,
            })),
            progress,
        };
    }
}