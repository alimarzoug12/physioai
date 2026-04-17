// src/doctors/doctors.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DoctorsService {
  private readonly logger = new Logger(DoctorsService.name);

  constructor(private prisma: PrismaService) {}

  private getExpYears(bio?: string): number {
    const match = (bio || '').match(/(\d+)\s+years?/i);
    return match ? parseInt(match[1], 10) : 5;
  }

  private formatDoctor(d: any, index = 0) {
    const expYears = this.getExpYears(d.bio);
    return {
      id:              d.id,
      fullName:        d.user.fullName,
      phone:           d.user.phone    ?? '',
      email:           d.user.email    ?? '',
      specialty:       d.specialties[0] ?? 'Physiotherapist',
      specialties:     d.specialties,
      rating:          d.rating,
      pricePerSession: d.pricePerSession,
      languages:       d.languages,
      bio:             d.bio ?? '',
      experience:      `${expYears} years`,   // kept for SpecialistProfile
      experienceYears: expYears,              // added for BookSession
      centerName:      d.center.name,
      centerCity:      d.center.city,
      centerAddress:   d.center.address,
      centerPhone:     d.center.phone  ?? '',
      centerEmail:     d.center.email  ?? '',
      isAvailable:     d.isAvailable,
      avatarUrl:       `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=${index % 2 === 0 ? '3b82f6' : '8b5cf6'}&color=fff&size=200`,
      isTopPick:       index === 0,
    };
  }

  async getAllDoctors() {
    const today    = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86_400_000);

    const doctors = await this.prisma.doctor.findMany({
      where:   { isAvailable: true },
      include: {
        user:   true,
        center: true,
        slots: {
          where:   { isBooked: false, date: { gte: today, lt: tomorrow } },
          orderBy: { startTime: 'asc' },
          take:    4,
        },
      },
      orderBy: { rating: 'desc' },
    });

    return doctors.map((d, i) => ({
      ...this.formatDoctor(d, i),
      todaySlots: d.slots.map(s => ({
        id: s.id, startTime: s.startTime, endTime: s.endTime,
      })),
    }));
  }

  async getDoctorById(id: string) {
    this.logger.log(`getDoctorById called with id: ${id}`);

    const today    = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86_400_000);
    const dayAfter = new Date(today.getTime() + 2 * 86_400_000);

    const d = await this.prisma.doctor.findUnique({
      where:   { id },
      include: {
        user:   true,
        center: true,
        slots: {
          where:   { isBooked: false, date: { gte: today, lt: dayAfter } },
          orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        },
      },
    });

    if (!d) {
      this.logger.error(`Doctor not found for id: ${id}`);
      throw new NotFoundException(`Doctor not found: ${id}`);
    }

    this.logger.log(`Found doctor: ${d.user.fullName}`);

    const [patientsTreated, totalBookings] = await Promise.all([
      this.prisma.booking.count({ where: { doctorId: id, status: 'COMPLETED' } }),
      this.prisma.booking.count({ where: { doctorId: id } }),
    ]);

    const successRate = totalBookings > 0
      ? Math.round((patientsTreated / totalBookings) * 100)
      : 95;

    const todaySlots    = d.slots.filter(s => new Date(s.date) < tomorrow);
    const tomorrowSlots = d.slots.filter(s => new Date(s.date) >= tomorrow);

    const sameCenter = await this.getOtherDoctorsInCenter(d.centerId, id);

    return {
      ...this.formatDoctor(d, 0),
      patientsTreated,
      successRate,
      todaySlots:    todaySlots.map(s => ({ id: s.id, startTime: s.startTime, endTime: s.endTime })),
      tomorrowSlots: tomorrowSlots.map(s => ({ id: s.id, startTime: s.startTime, endTime: s.endTime })),
      sameCenter,
    };
  }

  private async getOtherDoctorsInCenter(centerId: string, excludeId: string) {
    const others = await this.prisma.doctor.findMany({
      where:   { centerId, id: { not: excludeId }, isAvailable: true },
      include: { user: true },
      take:    3,
    });

    return others.map((d, i) => ({
      id:        d.id,
      fullName:  d.user.fullName,
      specialty: d.specialties[0] ?? '',
      rating:    d.rating,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=3b82f6&color=fff&size=128`,
    }));
  }
}