// src/bookings/bookings.service.ts
import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { HomeVisitService } from './dto/home-visit.service';
import { MailService } from '../mail/mail.service';


function getCancellationPolicy(slotDate: Date, slotTime: string): {
  refundPercent: number;
  policyLabel: string;
} {
  // Parse the slot datetime
  const [timePart, meridiem] = slotTime.toUpperCase().split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  const sessionDate = new Date(slotDate);
  sessionDate.setHours(hours, minutes, 0, 0);

  const now = new Date();
  const hoursUntil = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntil >= 24) {
    return { refundPercent: 100, policyLabel: 'Full refund (cancelled 24h+ before)' };
  }
  if (hoursUntil >= 6) {
    return { refundPercent: 50, policyLabel: '50% refund (cancelled 6–24h before)' };
  }
  return { refundPercent: 0, policyLabel: 'No refund (cancelled less than 6h before)' };
}
@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  constructor(private prisma: PrismaService, private notifications: NotificationsService, private homeVisitSvc: HomeVisitService, private mail: MailService,) { }

  async createBooking(patientId: string, dto: CreateBookingDto) {
    // Verify slot is still available
    const slot = await this.prisma.slot.findUnique({ where: { id: dto.slotId } });
    if (!slot) throw new NotFoundException('Slot not found');
    const activeBooking = await this.prisma.booking.findFirst({
      where: {
        slotId: dto.slotId,
        status: { in: ['PENDING', 'CONFIRMED'] }, // ✅ only block if active
      },
    });
    if (activeBooking) {
      throw new BadRequestException('This slot is already booked');
    }

    // ✅ Also check slot.isBooked as a safety net
    if (slot.isBooked) {
      // Verify it's not just a stale flag from a cancelled booking
      const staleCancelledBooking = await this.prisma.booking.findFirst({
        where: {
          slotId: dto.slotId,
          status: { in: ['CANCELLED', 'COMPLETED'] },
        },
      });
      if (!staleCancelledBooking) {
        throw new BadRequestException('This slot is already booked');
      }
      // It's just a stale flag — reset it and continue
      await this.prisma.slot.update({
        where: { id: dto.slotId },
        data: { isBooked: false },
      });
    }

    // ── Home visit validation ─────────────────────────────────────
    let travelFee = 0;
    let distanceKm = 0;

    if (dto.sessionType === 'HOME_VISIT') {
      if (!dto.homeAddress) {
        throw new BadRequestException(
          'Home address is required for home visit sessions',
        );
      }

      // Calculate travel fee if coordinates provided
      if (dto.latitude && dto.longitude) {
        const doctor = await this.prisma.doctor.findUnique({
          where: { id: dto.doctorId },
          include: { center: true },
        });

        if (doctor?.center?.latitude && doctor?.center?.longitude) {
          const result = this.homeVisitSvc.estimateFee(
            dto.latitude, dto.longitude,
            doctor.center.latitude, doctor.center.longitude,
          );
          travelFee = result.travelFee;
          distanceKm = result.distanceKm;

          this.logger.log(
            `Home visit: ${result.breakdown} for patient ${patientId}`,
          );
        } else {
          // No center coordinates — use flat fee
          travelFee = 80;
        }
      } else {
        // No patient coordinates — use flat fee
        travelFee = 80;
      }
    }

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
    const isPaidImmediately = false;

    // 5. Run everything in a transaction
    const result = await this.prisma.$transaction(async tx => {
      // Create the booking
      const booking = await tx.booking.create({
        data: {
          patientId,
          doctorId: dto.doctorId,
          slotId: dto.slotId,
          sessionType: dto.sessionType,
          notes: combinedNotes,
          bookedVia: 'APP',
          status: isPaidImmediately ? 'CONFIRMED' : 'PENDING',
          totalAmount: dto.totalAmount,
          homeAddress: dto.homeAddress || null,
          latitude: dto.latitude || null,
          longitude: dto.longitude || null,
          travelFee: travelFee > 0 ? travelFee : null,
          ...(isPaidImmediately ? { paidAt: new Date() } : {}),
        },
      });

      // Lock the slot
      await tx.slot.update({
        where: { id: dto.slotId },
        data: { isBooked: true },
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
          data: { balance: { decrement: dto.totalAmount } },
        });

        // Create debit transaction record (shows in wallet history)
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'DEBIT',
            category: dto.sessionType === 'HOME_VISIT' ? 'HOME_VISIT' : 'SESSION',
            title: 'Session Payment',
            subtitle: `Booking confirmed — ${dto.totalAmount} QAR`,
            amount: -dto.totalAmount,  // negative = debit
            status: 'COMPLETED',
          },
        });

        // Add reward points (1 point per QAR spent)
        const points = Math.floor(dto.totalAmount);
        await tx.reward.updateMany({
          where: { wallet: { userId: patientId } },
          data: { points: { increment: points } },
        });

        this.logger.log(
          `Wallet payment: deducted ${dto.totalAmount} QAR from user ${patientId}. Points added: ${points}`,
        );
      }

      // Apply promo code usage increment if provided
      if (dto.promoCode) {
        await tx.promoCode.updateMany({
          where: { code: dto.promoCode },
          data: { usageCount: { increment: 1 } },
        }).catch(() => { }); // silent — promo may not exist
      }



      return booking;
    });

    this.logger.log(
      `Booking created: ${result.id} | patient: ${patientId} | method: ${dto.paymentMethod} | amount: ${dto.totalAmount}`,
    );
    try {
      const [doctor, patient] = await Promise.all([
        this.prisma.doctor.findUnique({
          where: { id: dto.doctorId },
          include: { user: true, center: true },  // ✅ add center for email
        }),
        this.prisma.user.findUnique({ where: { id: patientId } }),
      ]);

      const dateStr = new Date(slot.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric',
      });

      // Notify patient — only when payment is immediate (wallet/cash)
      // Notify patient that booking request was received (not confirmed yet)
      this.notifications.send({
        userId: patientId,
        type: 'BOOKING_CONFIRMED',
        title: '📋 Booking Request Sent',
        message: `Your session request with Dr. ${doctor?.user.fullName || 'your doctor'} on ${dateStr} is awaiting confirmation.`,
        data: { bookingId: result.id },
      }).catch(() => { });

      // Notify doctor of new booking
      if (doctor?.userId) {
        this.notifications.notifyDoctorNewBooking(
          doctor.userId,
          result.id,
          patient?.fullName || 'A patient',
          dateStr,
        ).catch(() => { });
      }

      // ✅ Send confirmation email (fire-and-forget)
      // if (isPaidImmediately  && patient && doctor) {
      //   this.mail.sendBookingConfirmation({
      //     patientName: patient.fullName,
      //     patientEmail: patient.email,
      //     doctorName: doctor.user.fullName,
      //     specialty: doctor.specialties[0] ?? 'Physiotherapy',
      //     sessionDate: new Date(slot.date).toLocaleDateString('en-US', {
      //       weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      //     }),
      //     sessionTime: slot.startTime,
      //     sessionType: dto.sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic Visit',
      //     centerName: (doctor as any).center?.name ?? '',
      //     centerAddress: (doctor as any).center?.address ?? '',
      //     duration: dto.durationMinutes,
      //     totalAmount: dto.totalAmount,
      //     currency: 'QAR',
      //     bookingId: result.id,
      //   }).catch(() => { });
      // }

    } catch {
      // Silent — notifications never block booking response
    }

    const needsStripePayment = dto.paymentMethod === 'card' || dto.paymentMethod === 'sadad';

    return {
      bookingId: result.id,
      status: result.status,
      totalAmount: dto.totalAmount,
      paymentMethod: dto.paymentMethod,
      // Only card/sadad redirect to Stripe — wallet/cash go straight to "pending"
      requiresPayment: needsStripePayment,
      message: needsStripePayment
        ? 'Booking created. Please complete payment to confirm.'
        : 'Booking request sent! Waiting for doctor confirmation.',
    };
  }

  async cancelBooking(bookingId: string, patientId: string, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        slot: true,
        payment: true,
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.patientId !== patientId) throw new BadRequestException('Access denied');

    if (['CANCELLED', 'COMPLETED'].includes(booking.status)) {
      throw new BadRequestException(
        `Booking is already ${booking.status.toLowerCase()} and cannot be cancelled`,
      );
    }

    // Apply cancellation policy
    const policy = getCancellationPolicy(booking.slot.date, booking.slot.startTime);

    this.logger.log(
      `Cancelling booking ${bookingId} — ${policy.policyLabel} — refund: ${policy.refundPercent}%`,
    );

    await this.prisma.$transaction(async tx => {
      // 1. Mark booking cancelled
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: dto.reason || 'Cancelled by patient',
        },
      });

      // 2. Free the slot
      await tx.slot.update({
        where: { id: booking.slotId },
        data: { isBooked: false },
      });

      // 3. Process refund based on payment method and policy
      if (booking.totalAmount && policy.refundPercent > 0) {
        const refundAmount = Math.round(
          (booking.totalAmount * policy.refundPercent) / 100,
        );

        // Refund to wallet if paid by wallet or if no Stripe payment
        const paidByWallet = !booking.payment || booking.payment.provider === 'wallet';
        const paidByCard = booking.payment?.status === 'CAPTURED' &&
          booking.payment?.provider !== 'wallet';

        if (paidByWallet) {
          // Refund wallet balance
          const wallet = await tx.wallet.findUnique({ where: { userId: patientId } });
          if (wallet) {
            await tx.wallet.update({
              where: { id: wallet.id },
              data: { balance: { increment: refundAmount } },
            });

            await tx.transaction.create({
              data: {
                walletId: wallet.id,
                type: 'CREDIT',
                category: 'OTHER',
                title: 'Booking Refund',
                subtitle: `${policy.policyLabel} — ${refundAmount} QAR`,
                amount: refundAmount,
                status: 'COMPLETED',
              },
            });

            this.logger.log(
              `Wallet refund: ${refundAmount} QAR to user ${patientId}`,
            );
          }
        }

        // For card payments — mark for Stripe refund
        // The actual Stripe refund is handled by PaymentsService
        if (paidByCard && booking.payment) {
          await tx.payment.update({
            where: { id: booking.payment.id },
            data: { status: 'REFUNDED' },
          });
        }
      }
    });

    const refundAmount = booking.totalAmount
      ? Math.round((booking.totalAmount * policy.refundPercent) / 100)
      : 0;

    this.notifications.notifyBookingCancelled(patientId, bookingId, refundAmount).catch(() => { });

    try {
      const [patient, doctor] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: patientId } }),
        this.prisma.doctor.findUnique({
          where: { id: booking.doctorId },
          include: { user: true },
        }),
      ]);

      if (patient && doctor) {
        this.mail.sendBookingCancelled({
          patientName: patient.fullName,
          patientEmail: patient.email,
          doctorName: doctor.user.fullName,
          sessionDate: booking.slot.date.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
          }),
          sessionTime: booking.slot.startTime,
          refundAmount,
          refundPercent: policy.refundPercent,
          currency: 'QAR',
          bookingId: booking.id,
        }).catch(() => { });
      }
    } catch { /* silent */ }

    return {
      cancelled: true,
      bookingId,
      refundPercent: policy.refundPercent,
      refundAmount: booking.totalAmount
        ? Math.round((booking.totalAmount * policy.refundPercent) / 100)
        : 0,
      policyLabel: policy.policyLabel,
      message: policy.refundPercent > 0
        ? `Booking cancelled. ${policy.policyLabel}.`
        : 'Booking cancelled. No refund applies per cancellation policy.',
    };
  }

  // ── Reschedule Booking ─────────────────────────────────────────
  async rescheduleBooking(
    bookingId: string,
    patientId: string,
    dto: RescheduleBookingDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { slot: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.patientId !== patientId) throw new BadRequestException('Access denied');

    if (['CANCELLED', 'COMPLETED'].includes(booking.status)) {
      throw new BadRequestException(
        `Cannot reschedule a ${booking.status.toLowerCase()} booking`,
      );
    }

    // Verify new slot exists and is free
    const newSlot = await this.prisma.slot.findUnique({
      where: { id: dto.newSlotId },
    });
    if (!newSlot) throw new NotFoundException('New slot not found');
    if (newSlot.isBooked) throw new BadRequestException('This slot is already booked');

    // Rescheduling policy: only allowed 6+ hours before session
    const policy = getCancellationPolicy(booking.slot.date, booking.slot.startTime);
    if (policy.refundPercent === 0) {
      throw new BadRequestException(
        'Rescheduling is not allowed less than 6 hours before your session',
      );
    }

    // Check new slot is in the future
    const newSlotDate = new Date(newSlot.date);
    if (newSlotDate < new Date()) {
      throw new BadRequestException('Cannot reschedule to a past date');
    }

    await this.prisma.$transaction(async tx => {
      // 1. Free old slot
      await tx.slot.update({
        where: { id: booking.slotId },
        data: { isBooked: false },
      });

      // 2. Lock new slot
      await tx.slot.update({
        where: { id: dto.newSlotId },
        data: { isBooked: true },
      });

      // 3. Update booking with new slot
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          slotId: dto.newSlotId,
          status: 'CONFIRMED',
          rescheduledAt: new Date(),
        },
      });
    });

    this.logger.log(
      `Booking ${bookingId} rescheduled from slot ${booking.slotId} to ${dto.newSlotId}`,
    );

    // ── NOTIFICATION — after transaction ───────────────────────────
    const newDateStr = new Date(newSlot.date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    });
    this.notifications.notifyBookingRescheduled(
      patientId, bookingId, newDateStr, newSlot.startTime,
    ).catch(() => { });

    try {
      const [patient, doctor] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: patientId } }),
        this.prisma.doctor.findUnique({
          where: { id: booking.doctorId },
          include: { user: true, center: true },
        }),
      ]);

      if (patient && doctor) {
        this.mail.sendBookingRescheduled({
          patientName: patient.fullName,
          patientEmail: patient.email,
          doctorName: doctor.user.fullName,
          specialty: doctor.specialties[0] ?? 'Physiotherapy',
          oldDate: booking.slot.date.toLocaleDateString('en-US', {
            weekday: 'long', month: 'short', day: 'numeric',
          }),
          oldTime: booking.slot.startTime,
          newDate: newSlot.date.toLocaleDateString('en-US', {
            weekday: 'long', month: 'short', day: 'numeric',
          }),
          newTime: newSlot.startTime,
          sessionType: booking.sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic Visit',
          centerName: (doctor as any).center?.name ?? '',
          bookingId: booking.id,
        }).catch(() => { });
      }
    } catch { /* silent */ }

    return {
      rescheduled: true,
      bookingId,
      newSlotId: dto.newSlotId,
      newDate: newSlot.date,
      newTime: newSlot.startTime,
      message: 'Booking rescheduled successfully!',
    };
  }

  // ── Get Cancellation Policy Preview ───────────────────────────
  // Called before cancellation to show user what refund they'll get
  async getCancellationPolicy(bookingId: string, patientId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { slot: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.patientId !== patientId) throw new BadRequestException('Access denied');

    if (['CANCELLED', 'COMPLETED'].includes(booking.status)) {
      return {
        canCancel: false,
        canReschedule: false,
        reason: `Booking is already ${booking.status.toLowerCase()}`,
      };
    }

    const policy = getCancellationPolicy(booking.slot.date, booking.slot.startTime);
    const refundAmount = booking.totalAmount
      ? Math.round((booking.totalAmount * policy.refundPercent) / 100)
      : 0;

    return {
      canCancel: true,
      canReschedule: policy.refundPercent > 0, // can reschedule if 6h+ before
      refundPercent: policy.refundPercent,
      refundAmount,
      totalPaid: booking.totalAmount ?? 0,
      policyLabel: policy.policyLabel,
      sessionDate: booking.slot.date,
      sessionTime: booking.slot.startTime,
    };
  }

  // ── Get Booking By ID ──────────────────────────────────────────
  async getBookingById(bookingId: string, patientId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        doctor: { include: { user: true, center: true } },
        slot: true,
        payment: true,
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.patientId !== patientId) throw new BadRequestException('Access denied');

    return booking;
  }

  async estimateTravelFee(
    doctorId: string,
    patientLat: number,
    patientLon: number,
  ) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { center: true },
    });

    if (!doctor) throw new NotFoundException('Doctor not found');

    if (!doctor.center?.latitude || !doctor.center?.longitude) {
      return { travelFee: 80, distanceKm: null, message: 'Flat fee applied' };
    }

    return this.homeVisitSvc.estimateFee(
      patientLat, patientLon,
      doctor.center.latitude, doctor.center.longitude,
    );
  }

  async getAllBookings(patientId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, bookings] = await Promise.all([
      this.prisma.booking.count({ where: { patientId } }),
      this.prisma.booking.findMany({
        where: { patientId },
        include: {
          doctor: { include: { user: true, center: true } },
          slot: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: bookings,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async confirmBooking(bookingId: string, doctorId: string) {
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: {
        patient: true,
        doctor: { include: { user: true, center: true } },
        slot: true,
      },
    });

    // ✅ Match exact BookingConfirmationData interface
    await this.mail.sendBookingConfirmation({
      patientName: booking.patient.fullName,
      patientEmail: booking.patient.email,          // ✅ patientEmail not to
      doctorName: booking.doctor.user.fullName,
      specialty: booking.doctor.specialties[0] ?? 'Physiotherapy',
      sessionDate: new Date(booking.slot.date).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      }),
      sessionTime: booking.slot.startTime,
      sessionType: booking.sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic Visit',
      centerName: booking.doctor.center?.name ?? '',  // ✅ centerName not center
      centerAddress: booking.doctor.center?.address ?? '',
      duration: 60,
      totalAmount: booking.totalAmount ?? 0,
      currency: 'QAR',
      bookingId: booking.id,
    });

    this.logger.log(`✅ Booking ${bookingId} confirmed — email sent to ${booking.patient.email}`);
    return booking;
  }

  // Add these new methods to BookingsService, anywhere in the class:

  async getPendingBookingsForDoctor(userId: string) {
    this.logger.log(`🔍 Looking for doctor with userId: ${userId}`);
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    this.logger.log(`🔍 Doctor found: ${doctor?.id ?? 'NONE'}`);
    if (!doctor) throw new BadRequestException('Doctor profile not found');

    const bookings = await this.prisma.booking.findMany({
      where: { doctorId: doctor.id, status: 'PENDING' },
      include: { patient: true, slot: true },
      orderBy: { createdAt: 'desc' },
    });

    this.logger.log(`🔍 Found ${bookings.length} pending bookings for doctor ${doctor.id}`);

    return bookings.map(b => ({
      id: b.id,
      patientName: b.patient.fullName,
      patientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.patient.fullName)}&background=3b82f6&color=fff`,
      sessionType: b.sessionType,
      date: b.slot.date,
      time: b.slot.startTime,
      notes: b.notes,
      bookedVia: b.bookedVia,
      createdAt: b.createdAt,
    }));
  }

  async confirmBookingByDoctor(bookingId: string, userId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new BadRequestException('Doctor profile not found');

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { patient: true, slot: true, doctor: { include: { user: true, center: true } } },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.doctorId !== doctor.id) throw new BadRequestException('Not your booking');
    if (booking.status !== 'PENDING') throw new BadRequestException('Booking is not pending');

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED', paidAt: new Date() },
    });

    const dateStr = new Date(booking.slot.date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    });

    this.notifications.notifyBookingConfirmed(
      booking.patientId,
      bookingId,
      booking.doctor.user.fullName,
      dateStr,
    ).catch(() => { });

    this.mail.sendBookingConfirmation({
      patientName: booking.patient.fullName,
      patientEmail: booking.patient.email,
      doctorName: booking.doctor.user.fullName,
      specialty: booking.doctor.specialties[0] ?? 'Physiotherapy',
      sessionDate: new Date(booking.slot.date).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      }),
      sessionTime: booking.slot.startTime,
      sessionType: booking.sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic Visit',
      centerName: booking.doctor.center?.name ?? '',
      centerAddress: booking.doctor.center?.address ?? '',
      duration: 60,
      totalAmount: booking.totalAmount ?? 0,
      currency: 'QAR',
      bookingId: booking.id,
    }).catch(() => { });

    this.logger.log(`Doctor ${userId} confirmed booking ${bookingId}`);

    return { confirmed: true, bookingId, message: 'Booking confirmed' };
  }

  async rejectBookingByDoctor(bookingId: string, userId: string, reason?: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new BadRequestException('Doctor profile not found');

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { slot: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.doctorId !== doctor.id) throw new BadRequestException('Not your booking');
    if (booking.status !== 'PENDING') throw new BadRequestException('Booking is not pending');

    await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED', cancelReason: reason || 'Rejected by doctor' },
      }),
      this.prisma.slot.update({
        where: { id: booking.slotId },
        data: { isBooked: false },
      }),
    ]);

    this.notifications.notifyBookingCancelled(booking.patientId, bookingId, 0).catch(() => { });

    this.logger.log(`Doctor ${userId} rejected booking ${bookingId}`);

    return { rejected: true, bookingId, message: 'Booking rejected' };
  }
}