// src/bookings/bookings.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(patientId: string, dto: CreateBookingDto) {
    // Verify slot is still available
    const slot = await this.prisma.slot.findUnique({ where: { id: dto.slotId } });
    if (!slot || slot.isBooked) {
      throw new BadRequestException('This time slot is no longer available');
    }

    // Mark slot as booked + create booking in a transaction
    const [, booking] = await this.prisma.$transaction([
      this.prisma.slot.update({
        where: { id: dto.slotId },
        data:  { isBooked: true },
      }),
      this.prisma.booking.create({
        data: {
          patientId,
          doctorId:    dto.doctorId,
          slotId:      dto.slotId,
          sessionType: dto.sessionType,
          notes:       [dto.notes, ...(dto.requirements ?? [])].filter(Boolean).join('\n'),
          bookedVia:   'APP',
          status:      'CONFIRMED',
        },
      }),
    ]);

    // Increment promo usage if applied
    if (dto.promoCode) {
      await this.prisma.promoCode.updateMany({
        where: { code: dto.promoCode },
        data:  { usageCount: { increment: 1 } },
      }).catch(() => {});
    }

    return {
      bookingId:  booking.id,
      status:     booking.status,
      totalAmount: dto.totalAmount,
      message:    'Booking confirmed successfully!',
    };
  }
}