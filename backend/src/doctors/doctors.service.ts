// src/doctors/doctors.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async getAllDoctors() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const doctors = await this.prisma.doctor.findMany({
      where: { isAvailable: true },
      include: {
        user: true,
        center: true,
        slots: {
          where: {
            isBooked: false,
            date: { gte: today, lt: tomorrow }, // today's free slots
          },
          orderBy: { startTime: 'asc' },
          take: 4,
        },
      },
      orderBy: { rating: 'desc' },
    });

    return doctors.map((d, index) => ({
      id: d.id,
      fullName: d.user.fullName,
      specialty: d.specialties[0] || 'Physiotherapist',
      specialties: d.specialties,
      rating: d.rating,
      pricePerSession: d.pricePerSession,
      languages: d.languages,
      bio: d.bio,
      experience: this.getExperienceLabel(d),
      centerName: d.center.name,
      centerCity: d.center.city,
      isAvailable: d.isAvailable,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=${index % 2 === 0 ? '3b82f6' : '8b5cf6'}&color=fff&size=200`,
      todaySlots: d.slots.map(s => ({
        id: s.id,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
      isTopPick: index === 0, // highest rated = top pick
    }));
  }

  // estimate experience from bio text or default
  private getExperienceLabel(doctor: any): string {
    const bio = doctor.bio || '';
    const match = bio.match(/(\d+)\s+years?/i);
    return match ? `${match[1]} years` : '5+ years';
  }
}