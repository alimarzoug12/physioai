// src/bookings/bookings.service.ts
import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  constructor(private prisma: PrismaService) {}

  async createBooking(patientId: string, dto: CreateBookingDto) {
    // Verify slot is still available
    const slot = await this.prisma.slot.findUnique({ where: { id: dto.slotId } });
    if (!slot)          throw new NotFoundException('Slot not found');
    if (slot.isBooked)  throw new BadRequestException('This slot is already booked');

    if (dto.paymentMethod === 'wallet') {
      const wallet = await this.prisma.wallet.findUnique({
        where: { userId: patientId },
      });
      if (!wallet) {
        throw new BadRequestException('Wallet not found. Please contact support.');
      }
      if (wallet.balance < dto.totalAmount) {
        throw new BadRequestException(
          `Insufficient wallet balance. You have ${wallet.balance} ${wallet.currency} but need ${dto.totalAmount} ${wallet.currency}.`,
        );
      }
    }
    // 3. Build notes string (includes requirements)
    const notesArr = [
      dto.notes,
      ...(dto.requirements ?? []),
    ].filter(Boolean);
    const combinedNotes = notesArr.join('\n') || undefined;

    // 4. Determine initial booking status
    //    - wallet/cash → CONFIRMED immediately
    //    - card/sadad  → PENDING (confirmed after payment)
    const isPaidImmediately =
      dto.paymentMethod === 'wallet' || dto.paymentMethod === 'cash';

    // 5. Run everything in a transaction
    const result = await this.prisma.$transaction(async tx => {
      // Create the booking
      const booking = await tx.booking.create({
        data: {
          patientId,
          doctorId:    dto.doctorId,
          slotId:      dto.slotId,
          sessionType: dto.sessionType,
          notes:       combinedNotes,
          bookedVia:   'APP',
          status:      isPaidImmediately ? 'CONFIRMED' : 'PENDING',
          totalAmount: dto.totalAmount,
          ...(isPaidImmediately ? { paidAt: new Date() } : {}),
        },
      });

      // Lock the slot
      await tx.slot.update({
        where: { id: dto.slotId },
        data:  { isBooked: true },
      });

      // If wallet payment — deduct balance and create transaction record
      if (dto.paymentMethod === 'wallet') {
        const wallet = await tx.wallet.findUnique({
          where: { userId: patientId },
        });

        if (!wallet) throw new BadRequestException('Wallet not found');

        // Deduct balance
        await tx.wallet.update({
          where: { id: wallet.id },
          data:  { balance: { decrement: dto.totalAmount } },
        });

        // Create debit transaction record (shows in wallet history)
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type:     'DEBIT',
            category: dto.sessionType === 'HOME_VISIT' ? 'HOME_VISIT' : 'SESSION',
            title:    'Session Payment',
            subtitle: `Booking confirmed — ${dto.totalAmount} QAR`,
            amount:   -dto.totalAmount,  // negative = debit
            status:   'COMPLETED',
          },
        });

        // Add reward points (1 point per QAR spent)
        const points = Math.floor(dto.totalAmount);
        await tx.reward.updateMany({
          where: { wallet: { userId: patientId } },
          data:  { points: { increment: points } },
        });

        this.logger.log(
          `Wallet payment: deducted ${dto.totalAmount} QAR from user ${patientId}. Points added: ${points}`,
        );
      }

      // Apply promo code usage increment if provided
      if (dto.promoCode) {
        await tx.promoCode.updateMany({
          where: { code: dto.promoCode },
          data:  { usageCount: { increment: 1 } },
        }).catch(() => {}); // silent — promo may not exist
      }

      return booking;
    });

    this.logger.log(
      `Booking created: ${result.id} | patient: ${patientId} | method: ${dto.paymentMethod} | amount: ${dto.totalAmount}`,
    );

    return {
      bookingId:   result.id,
      status:      result.status,
      totalAmount: dto.totalAmount,
      paymentMethod: dto.paymentMethod,
      // For card payments — frontend uses this to create a Stripe charge
      requiresPayment: !isPaidImmediately,
      message: isPaidImmediately
        ? 'Booking confirmed successfully!'
        : 'Booking created. Please complete payment to confirm.',
    };
  }

  async getBookingById(bookingId: string, patientId: string) {
    const booking = await this.prisma.booking.findUnique({
      where:   { id: bookingId },
      include: {
        doctor: { include: { user: true, center: true } },
        slot:   true,
      },
    });

    if (!booking)                          throw new NotFoundException('Booking not found');
    if (booking.patientId !== patientId)   throw new BadRequestException('Access denied');

    return booking;
  }
}