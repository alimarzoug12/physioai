// src/doctors/doctors.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DoctorsService {
  private readonly logger = new Logger(DoctorsService.name);

  constructor(private prisma: PrismaService) { }

  private getExpYears(bio?: string | null): number {
    const match = (bio || '').match(/(\d+)\s+years?/i);
    return match ? parseInt(match[1], 10) : 5;
  }

  private formatDoctor(d: any, index = 0) {
    const expYears = this.getExpYears(d.bio);
    return {
      id: d.id,
      fullName: d.user.fullName,
      phone: d.user.phone ?? '',
      email: d.user.email ?? '',
      specialty: d.specialties[0] ?? 'Physiotherapist',
      specialties: d.specialties,
      rating: d.rating,
      pricePerSession: d.pricePerSession,
      languages: d.languages,
      bio: d.bio ?? '',
      experience: `${expYears} years`,   // kept for SpecialistProfile
      experienceYears: expYears,              // added for BookSession
      centerName: d.center.name,
      centerCity: d.center.city,
      centerAddress: d.center.address,
      centerPhone: d.center.phone ?? '',
      centerEmail: d.center.email ?? '',
      isAvailable: d.isAvailable,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=${index % 2 === 0 ? '3b82f6' : '8b5cf6'}&color=fff&size=200`,
      isTopPick: index === 0,
    };
  }

  async getAllDoctors() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86_400_000);

    const doctors = await this.prisma.doctor.findMany({
      where: { isAvailable: true },
      include: {
        user: true,
        center: true,
        slots: {
          where: { isBooked: false, date: { gte: today, lt: tomorrow } },
          orderBy: { startTime: 'asc' },
          take: 4,
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

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86_400_000);
    const dayAfter = new Date(today.getTime() + 2 * 86_400_000);

    const d = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: true,
        center: true,
        slots: {
          where: { isBooked: false, date: { gte: today, lt: dayAfter } },
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

    const todaySlots = d.slots.filter(s => new Date(s.date) < tomorrow);
    const tomorrowSlots = d.slots.filter(s => new Date(s.date) >= tomorrow);

    const sameCenter = await this.getOtherDoctorsInCenter(d.centerId, id);

    return {
      ...this.formatDoctor(d, 0),
      patientsTreated,
      successRate,
      todaySlots: todaySlots.map(s => ({ id: s.id, startTime: s.startTime, endTime: s.endTime })),
      tomorrowSlots: tomorrowSlots.map(s => ({ id: s.id, startTime: s.startTime, endTime: s.endTime })),
      sameCenter,
    };
  }

  private async getOtherDoctorsInCenter(centerId: string, excludeId: string) {
    const others = await this.prisma.doctor.findMany({
      where: { centerId, id: { not: excludeId }, isAvailable: true },
      include: { user: true },
      take: 3,
    });

    return others.map((d, i) => ({
      id: d.id,
      fullName: d.user.fullName,
      specialty: d.specialties[0] ?? '',
      rating: d.rating,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=3b82f6&color=fff&size=128`,
    }));
  }

  async getSlotsForDate(doctorId: string, date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const slots = await this.prisma.slot.findMany({
      where: {
        doctorId,
        date: { gte: start, lte: end },
      },
      orderBy: { startTime: 'asc' },
    });

    return slots.map(slot => ({
      id: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: slot.isBooked,
      status: slot.isBooked ? 'booked' : 'available',
    }));
  }

  private getPeriod(time: string): 'morning' | 'afternoon' | 'evening' {
    const hour = this.parseHour(time);
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  private parseHour(time: string): number {
    // Handles "9:00 AM", "2:30 PM", "14:30" etc.
    const upper = time.toUpperCase();
    const [timePart, meridiem] = upper.includes('AM') || upper.includes('PM')
      ? [upper.replace(/\s?(AM|PM)/, '').trim(), upper.includes('PM') ? 'PM' : 'AM']
      : [upper, null];
    let [h] = timePart.split(':').map(Number);
    if (meridiem === 'PM' && h !== 12) h += 12;
    if (meridiem === 'AM' && h === 12) h = 0;
    return h;
  }

  async getDoctorMe(userId: string) {
    const d = await this.prisma.doctor.findUnique({
      where: { userId },
      include: { user: true, center: true },
    });
    if (!d) throw new NotFoundException('Doctor profile not found');

    const totalPatients = await this.prisma.booking.findMany({
      where: { doctorId: d.id },
      select: { patientId: true },
      distinct: ['patientId'],
    });

    const completedSessions = await this.prisma.booking.count({
      where: { doctorId: d.id, status: 'COMPLETED' },
    });

    return {
      id: d.id,
      fullName: d.user.fullName,
      email: d.user.email,
      phone: d.user.phone,
      specialty: d.specialties[0] || 'Physiotherapist',
      rating: d.rating,
      experience: this.getExpYears(d.bio),
      center: d.center.name,
      isAvailable: d.isAvailable,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=3b82f6&color=fff&size=200`,
      totalPatients: totalPatients.length,
      completedSessions,
    };
  }
}