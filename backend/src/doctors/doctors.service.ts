// src/doctors/doctors.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface DoctorFilters {
  specialty?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  language?: string;
  available?: boolean;
  search?: string;
  sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'experience';
  page?: number;
  limit?: number;
}
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
      hasAvailableSlot: d.slots?.length > 0,
    };
  }

  async getAllDoctors(page = 1, limit = 10, filters?: {
    search?: string;
    specialty?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    language?: string;
    available?: boolean;
    sortBy?: string;
  }) {
    const skip = (page - 1) * limit;
    const where: any = { isAvailable: true };

    if (filters?.specialty) where.specialties = { has: filters.specialty };
    if (filters?.language) where.languages = { has: filters.language };
    if (filters?.minPrice || filters?.maxPrice) {
      where.pricePerSession = {};
      if (filters.minPrice) where.pricePerSession.gte = filters.minPrice;
      if (filters.maxPrice) where.pricePerSession.lte = filters.maxPrice;
    }
    if (filters?.rating) where.rating = { gte: filters.rating };
    if (filters?.search) {
      where.user = { fullName: { contains: filters.search, mode: 'insensitive' } };
    }
    if (filters?.city) {
      where.center = { city: { contains: filters.city, mode: 'insensitive' } };
    }

    const orderBy: any =
      filters?.sortBy === 'price_asc' ? { pricePerSession: 'asc' } :
        filters?.sortBy === 'price_desc' ? { pricePerSession: 'desc' } :
          { rating: 'desc' };
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 86_400_000);

    const [total, doctors] = await Promise.all([
      this.prisma.doctor.count({ where }),
      this.prisma.doctor.findMany({
        where,
        include: {
          user: true,
          center: true,
          slots: {
            where: {
              isBooked: false,
              date: { gte: now, lt: weekEnd },
            },
            orderBy: { startTime: 'asc' },
            take: 4,
          },
        },
        orderBy: { rating: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const mapped = doctors.map((d, i) => ({
      ...this.formatDoctor(d, i),
      todaySlots: d.slots.map(s => ({
        id: s.id, startTime: s.startTime, endTime: s.endTime,
      })),
      hasAvailableSlot: d.slots.length > 0,
    }));

    return {
      doctors: mapped,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
    };
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

  // async getSlotsForDate(doctorId: string, date: string) {
  //   const start = new Date(date);
  //   start.setHours(0, 0, 0, 0);
  //   const end = new Date(date);
  //   end.setHours(23, 59, 59, 999);

  //   const slots = await this.prisma.slot.findMany({
  //     where: {
  //       doctorId,
  //       date: { gte: start, lte: end },
  //     },
  //     orderBy: { startTime: 'asc' },
  //   });

  //   return slots.map(slot => ({
  //     id: slot.id,
  //     startTime: slot.startTime,
  //     endTime: slot.endTime,
  //     isBooked: slot.isBooked,
  //     status: slot.isBooked ? 'booked' : 'available',
  //   }));
  // }

  async getSlotsForDate(doctorId: string, dateStr: string) {
    // Parse the date carefully — avoid timezone issues
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    const day = parseInt(parts[2], 10);

    // Use UTC midnight to avoid timezone shifting the date
    const dayStart = new Date(Date.UTC(year, month, day - 1, 12, 0, 0));
    const dayEnd = new Date(Date.UTC(year, month, day + 1, 12, 0, 0));

    this.logger.log(`getSlotsForDate: doctorId=${doctorId} date=${dateStr} range=${dayStart.toISOString()} → ${dayEnd.toISOString()}`);

    const slots = await this.prisma.slot.findMany({
      where: {
        doctorId,
        date: { gte: dayStart, lte: dayEnd },
      },
      orderBy: { startTime: 'asc' },
    });

    this.logger.log(`Found ${slots.length} slots for ${dateStr}`);

    return slots.map(s => ({
      id: s.id,
      time: s.startTime,
      startTime: s.startTime,
      endTime: s.endTime,
      isBooked: s.isBooked,
      status: s.isBooked ? 'booked' : 'available',
      period: this.getPeriod(s.startTime),
    }));
  }

  // private getPeriod(time: string): 'morning' | 'afternoon' | 'evening' {
  //   const hour = this.parseHour(time);
  //   if (hour < 12) return 'morning';
  //   if (hour < 17) return 'afternoon';
  //   return 'evening';
  // }

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
  async findAll(filters: DoctorFilters = {}) {
    const {
      specialty,
      city,
      minPrice,
      maxPrice,
      rating,
      language,
      available,
      search,
      sortBy = 'rating',
      page = 1,
      limit = 20,
    } = filters;

    const skip = (page - 1) * limit;

    // ── Build WHERE clause ─────────────────────────────────────
    const where: any = {};

    // Available filter
    if (available !== undefined) {
      where.isAvailable = available;
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerSession = {};
      if (minPrice !== undefined) where.pricePerSession.gte = minPrice;
      if (maxPrice !== undefined) where.pricePerSession.lte = maxPrice;
    }

    // Minimum rating
    if (rating !== undefined) {
      where.rating = { gte: rating };
    }

    // Specialty filter (case-insensitive)
    if (specialty && specialty.trim()) {
      where.specialties = {
        hasSome: [specialty],
      };
    }

    // Language filter
    if (language && language.trim()) {
      where.languages = {
        hasSome: [language],
      };
    }

    // City filter — through the center relation
    if (city && city.trim()) {
      where.center = {
        city: {
          contains: city,
          mode: 'insensitive',
        },
      };
    }

    // Full-text search on name + specialty
    // Searches both the user's fullName and the doctor's specialties
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        {
          user: {
            fullName: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          specialties: {
            hasSome: [searchTerm],
          },
        },
        // Also search for partial specialty matches
        {
          user: {
            fullName: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // ── Build ORDER BY clause ──────────────────────────────────
    let orderBy: any = { rating: 'desc' };

    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'price_asc':
        orderBy = { pricePerSession: 'asc' };
        break;
      case 'price_desc':
        orderBy = { pricePerSession: 'desc' };
        break;
      case 'experience':
        orderBy = { yearsExperience: 'desc' };
        break;
    }

    // ── Execute query ──────────────────────────────────────────
    const [doctors, total] = await Promise.all([
      this.prisma.doctor.findMany({
        where,
        include: {
          user: true,
          center: true,
          slots: {
            where: {
              isBooked: false,
              date: { gte: new Date() },
            },
            take: 1, // just need to know if any slot exists
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.doctor.count({ where }),
    ]);

    // ── Map to response shape ──────────────────────────────────
    const results = doctors.map(d => ({
      id: d.id,
      fullName: d.user.fullName,
      specialty: d.specialties[0] ?? 'General Physiotherapy',
      specialties: d.specialties,
      rating: d.rating ?? 0,
      pricePerSession: d.pricePerSession ?? 0,
      experience: `${d.yearsExperience ?? 0} years`,
      // yearsExperience: d.yearsExperience ?? 0,
      centerName: d.center?.name ?? '',
      centerCity: d.center?.city ?? '',
      avatarUrl: d.user.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=3b82f6&color=fff&size=128`,
      isAvailable: d.isAvailable,
      languages: d.languages ?? ['en'],
      hasAvailableSlot: d.slots.length > 0,
    }));

    return {
      doctors: results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    };
  }

  // ── Get unique filter options (for filter dropdowns) ──────────
  async getFilterOptions() {
    const doctors = await this.prisma.doctor.findMany({
      include: { center: true },
    });

    // Collect all unique specialties
    const specialties = [...new Set(
      doctors.flatMap(d => d.specialties),
    )].sort();

    // Collect all unique cities
    const cities = [...new Set(
      doctors
        .map(d => d.center?.city)
        .filter(Boolean) as string[],
    )].sort();

    // Collect all unique languages
    const languages = [...new Set(
      doctors.flatMap(d => d.languages ?? ['en']),
    )].sort();

    // Price range
    const prices = doctors
      .map(d => d.pricePerSession ?? 0)
      .filter(p => p > 0);

    return {
      specialties,
      cities,
      languages,
      priceRange: {
        min: prices.length ? Math.min(...prices) : 0,
        max: prices.length ? Math.max(...prices) : 1000,
      },
    };
  }

  // ── Get single doctor ─────────────────────────────────────────
  // async findOne(id: string) {
  //   const doctor = await this.prisma.doctor.findUnique({
  //     where: { id },
  //     include: { user: true, center: true },
  //   });

  //   if (!doctor) return null;

  //   return {
  //     id: doctor.id,
  //     fullName: doctor.user.fullName,
  //     specialty: doctor.specialties[0] ?? 'General Physiotherapy',
  //     specialties: doctor.specialties,
  //     rating: doctor.rating ?? 0,
  //     pricePerSession: doctor.pricePerSession ?? 0,
  //     // experience: doctor.experience ?? '',
  //     centerName: doctor.center?.name ?? '',
  //     centerCity: doctor.center?.city ?? '',
  //     avatarUrl: doctor.user.avatarUrl ||
  //       `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user.fullName)}&background=3b82f6&color=fff&size=128`,
  //     isAvailable: doctor.isAvailable,
  //     languages: doctor.languages ?? ['en'],
  //   };
  // }

  // src/doctors/doctors.service.ts
  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: true,
        center: true,
        slots: {
          where: {
            isBooked: false,
            date: { gte: new Date() },
          },
          orderBy: { date: 'asc' },
          take: 20,
        },
      },
    });

    if (!doctor) return null;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const todaySlots = doctor.slots.filter(s =>
      s.date.toISOString().split('T')[0] === todayStr,
    );
    const tomorrowSlots = doctor.slots.filter(s =>
      s.date.toISOString().split('T')[0] === tomorrowStr,
    );

    // Get other doctors from same center
    const sameCenterDoctors = doctor.centerId
      ? await this.prisma.doctor.findMany({
        where: { centerId: doctor.centerId, id: { not: id } },
        include: { user: true },
        take: 5,
      })
      : [];

    // Count completed bookings for this doctor
    const completedBookings = await this.prisma.booking.count({
      where: { doctorId: id, status: 'COMPLETED' },
    });

    return {
      id: doctor.id,
      fullName: doctor.user.fullName,
      phone: doctor.user.phone ?? '',
      email: doctor.user.email,
      specialty: doctor.specialties[0] ?? 'General Physiotherapy',
      specialties: doctor.specialties,
      rating: doctor.rating ?? 0,
      pricePerSession: doctor.pricePerSession ?? 0,
      languages: doctor.languages ?? ['English'],
      bio: doctor.bio ?? `Dr. ${doctor.user.fullName} is a qualified physiotherapist with extensive experience.`,
      experience: `${doctor.yearsExperience ?? 0} years`,
      centerName: doctor.center?.name ?? '',
      centerCity: doctor.center?.city ?? '',
      centerAddress: doctor.center?.address ?? '',
      centerPhone: doctor.center?.phone ?? '',
      centerEmail: doctor.center?.email ?? '',
      isAvailable: doctor.isAvailable,
      avatarUrl: doctor.user.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user.fullName)}&background=3b82f6&color=fff&size=128`,
      patientsTreated: Math.max(completedBookings, 10),
      successRate: 95,
      todaySlots: todaySlots.map(s => ({
        id: s.id,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
      tomorrowSlots: tomorrowSlots.map(s => ({
        id: s.id,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
      sameCenter: sameCenterDoctors.map(d => ({
        id: d.id,
        fullName: d.user.fullName,
        specialty: d.specialties[0] ?? 'Physiotherapy',
        rating: d.rating ?? 0,
        avatarUrl: d.user.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=3b82f6&color=fff&size=128`,
      })),
    };
  }

  // ── Get slots for a date ──────────────────────────────────────

  private getPeriod(time: string): 'morning' | 'afternoon' | 'evening' {
    const upper = time.toUpperCase();
    let hour = parseInt(time.split(':')[0], 10);
    if (upper.includes('PM') && hour !== 12) hour += 12;
    if (upper.includes('AM') && hour === 12) hour = 0;
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  async findNearby(params: {
    lat: number;
    lon: number;
    radiusKm: number;
    page: number;
    limit: number;
    specialty?: string;
  }) {
    const { lat, lon, radiusKm, page, limit, specialty } = params;

    // Get all doctors with center coordinates
    const doctors = await this.prisma.doctor.findMany({
      where: {
        isAvailable: true,
        ...(specialty ? { specialties: { hasSome: [specialty] } } : {}),
        center: {
          latitude: { not: null },
          longitude: { not: null },
        },
      },
      include: { user: true, center: true },
      orderBy: { rating: 'desc' },
    });

    // Calculate distance using Haversine formula
    const withDistance = doctors
      .map(d => {
        const dist = this.haversine(
          lat, lon,
          Number(d.center.latitude!),
          Number(d.center.longitude!),
        );
        return { ...d, distanceKm: dist };
      })
      .filter(d => d.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    const total = withDistance.length;
    const paged = withDistance.slice((page - 1) * limit, page * limit);

    return {
      data: paged.map(d => ({
        id: d.id,
        fullName: d.user.fullName,
        specialty: d.specialties[0] ?? '',
        specialties: d.specialties,
        rating: d.rating,
        pricePerSession: d.pricePerSession,
        experience: d.yearsExperience ?? null,
        centerName: d.center?.name ?? '',
        centerCity: d.center?.city ?? '',
        centerLat: d.center?.latitude ? Number(d.center.latitude) : null,
        centerLon: d.center?.longitude ? Number(d.center.longitude) : null,
        distanceKm: Math.round(d.distanceKm * 10) / 10,
        avatarUrl: d.user.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=3b82f6&color=fff`,
        isAvailable: d.isAvailable,
        languages: d.languages,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      searchInfo: {
        lat, lon, radiusKm,
        found: total,
      },
    };
  }

  private haversine(
    lat1: number, lon1: number,
    lat2: number, lon2: number,
  ): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}