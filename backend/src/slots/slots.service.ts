// src/slots/slots.service.ts
import {
  Injectable, BadRequestException, NotFoundException,
  ForbiddenException, Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

function addMinutes(time: string, mins: number): string {
  const upper = time.toUpperCase();
  const isPM  = upper.includes('PM');
  const isAM  = upper.includes('AM');
  const clean = time.replace(/\s?(AM|PM)/i, '').trim();
  let [h, m]  = clean.split(':').map(Number);
  if (isPM && h !== 12) h += 12;
  if (isAM && h === 12) h  = 0;
  const total = h * 60 + m + mins;
  const nh    = Math.floor(total / 60) % 24;
  const nm    = total % 60;
  const period = nh < 12 ? 'AM' : 'PM';
  const dh     = nh === 0 ? 12 : nh > 12 ? nh - 12 : nh;
  return `${dh}:${String(nm).padStart(2, '0')} ${period}`;
}

function nextOccurrence(dow: number, from: Date): Date {
  const d    = new Date(from);
  const diff = (dow - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d;
}

@Injectable()
export class SlotsService {
  private readonly logger = new Logger(SlotsService.name);
  constructor(private prisma: PrismaService) {}

  private async getDoctorOrThrow(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new ForbiddenException('Doctor profile not found');
    return doctor;
  }

  // GET /slots/my-schedule?month=YYYY-MM
  async getMySchedule(userId: string, monthStr?: string) {
    const doctor = await this.getDoctorOrThrow(userId);
    const now    = new Date();
    const year   = monthStr ? parseInt(monthStr.split('-')[0]) : now.getFullYear();
    const month  = monthStr ? parseInt(monthStr.split('-')[1]) - 1 : now.getMonth();
    const start  = new Date(year, month, 1);
    const end    = new Date(year, month + 1, 0, 23, 59, 59);

    const slots = await this.prisma.slot.findMany({
      where:   { doctorId: doctor.id, date: { gte: start, lte: end } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    return slots.map(s => ({
      id:        s.id,
      date:      s.date,
      startTime: s.startTime,
      endTime:   s.endTime,
      isBooked:  s.isBooked,
      isBlocked: false, // extend schema if needed
    }));
  }

  // POST /slots/bulk
  async bulkCreate(userId: string, dto: {
    daysOfWeek:      number[];
    startTime:       string;
    durationMinutes: number;
    startDate:       string;
    endDate:         string;
  }) {
    const doctor    = await this.getDoctorOrThrow(userId);
    const endTime   = addMinutes(dto.startTime, dto.durationMinutes);
    const rangeEnd  = new Date(dto.endDate); rangeEnd.setHours(23, 59, 59);
    const rangeStart = new Date(dto.startDate);

    if (rangeStart > rangeEnd)    throw new BadRequestException('startDate must be before endDate');
    if (!dto.daysOfWeek.length)   throw new BadRequestException('Select at least one day');

    const dates: Date[] = [];
    for (const dow of dto.daysOfWeek) {
      let d = nextOccurrence(dow, new Date(rangeStart.getTime() - 86400000));
      while (d <= rangeEnd) {
        if (d >= rangeStart) dates.push(new Date(d));
        d = new Date(d.getTime() + 7 * 86400000);
      }
    }

    if (!dates.length)    throw new BadRequestException('No dates in range for selected days');
    if (dates.length > 200) throw new BadRequestException('Too many slots (max 200). Shorten the date range.');

    const existing = await this.prisma.slot.findMany({
      where: { doctorId: doctor.id, startTime: dto.startTime, date: { gte: rangeStart, lte: rangeEnd } },
      select: { date: true },
    });
    const existingDays = new Set(existing.map(s => s.date.toDateString()));
    const newDates     = dates.filter(d => !existingDays.has(d.toDateString()));

    if (!newDates.length) return { created: 0, skipped: dates.length, message: 'All slots already exist' };

    await this.prisma.slot.createMany({
      data: newDates.map(d => ({
        doctorId: doctor.id, date: d,
        startTime: dto.startTime, endTime, isBooked: false,
      })),
    });

    this.logger.log(`Bulk created ${newDates.length} slots for doctor ${doctor.id}`);
    return { created: newDates.length, skipped: dates.length - newDates.length, message: `${newDates.length} slots created` };
  }

  // DELETE /slots/:id
  async deleteSlot(userId: string, slotId: string) {
    const doctor = await this.getDoctorOrThrow(userId);
    const slot   = await this.prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot)                    throw new NotFoundException('Slot not found');
    if (slot.doctorId !== doctor.id) throw new ForbiddenException('Not your slot');
    if (slot.isBooked)            throw new BadRequestException('Cannot delete a booked slot');
    await this.prisma.slot.delete({ where: { id: slotId } });
    return { deleted: true, slotId };
  }

  // PATCH /slots/:id  — block / unblock
  async updateSlot(userId: string, slotId: string, dto: { isBlocked?: boolean }) {
    const doctor = await this.getDoctorOrThrow(userId);
    const slot   = await this.prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot)                       throw new NotFoundException('Slot not found');
    if (slot.doctorId !== doctor.id) throw new ForbiddenException('Not your slot');
    if (slot.isBooked && dto.isBlocked) throw new BadRequestException('Cannot block a booked slot');

    // We repurpose isBooked=true as "blocked" when no patient booking exists
    const updated = await this.prisma.slot.update({
      where: { id: slotId },
      data:  { isBooked: dto.isBlocked ?? slot.isBooked },
    });
    return { updated: true, slotId: updated.id, isBlocked: updated.isBooked };
  }

  // DELETE /slots/day?date=YYYY-MM-DD
  async deleteDaySlots(userId: string, dateStr: string) {
    const doctor = await this.getDoctorOrThrow(userId);
    const date   = new Date(dateStr);
    const start  = new Date(date); start.setHours(0, 0, 0, 0);
    const end    = new Date(date); end.setHours(23, 59, 59, 999);
    const result = await this.prisma.slot.deleteMany({
      where: { doctorId: doctor.id, isBooked: false, date: { gte: start, lte: end } },
    });
    return { deleted: result.count, message: `${result.count} slots removed` };
  }
}