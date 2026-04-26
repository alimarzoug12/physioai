import {
  Injectable, BadRequestException, NotFoundException,
  Logger, InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { StripeProvider } from './providers/stripe.provider';
import { TapProvider } from './providers/tap.provider';
import { IPaymentProvider } from './interfaces/payment-provider.interface';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly provider: IPaymentProvider;
  private readonly providerName: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private stripeProvider: StripeProvider,
    private tapProvider: TapProvider,
  ) {
    // Switch provider with one env variable
    this.providerName = this.config.get<string>('payment.provider') || 'stripe';
    this.provider = this.providerName === 'tap'
      ? this.tapProvider
      : this.stripeProvider;

    this.logger.log(`Payment provider: ${this.providerName.toUpperCase()}`);
  }

  // ── Create Charge ──────────────────────────────────────────────
  async createCharge(input: {
    bookingId: string;
    amount: number;
    currency: string;
    patientId: string;
    patientEmail: string;
    patientName: string;
    patientPhone?: string;
    description: string;
    redirectUrl: string;
  }) {
    // Verify booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: input.bookingId },
      include: { payment: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.patientId !== input.patientId) throw new BadRequestException('Access denied');
    if (booking.payment?.status === 'CAPTURED') {
      throw new BadRequestException('This booking has already been paid');
    }

    try {
      const result = await this.provider.createCharge({
        bookingId: input.bookingId,
        amount: input.amount,
        currency: input.currency,
        patientEmail: input.patientEmail,
        patientName: input.patientName,
        patientPhone: input.patientPhone,
        description: input.description,
        redirectUrl: input.redirectUrl,
      });

      // Save payment record
      // In createCharge method, replace the upsert with:
      await this.prisma.payment.upsert({
        where: { bookingId: input.bookingId },
        create: {
          bookingId: input.bookingId,
          patientId: input.patientId,
          amount: input.amount,
          currency: input.currency,
          status: 'PENDING',
          provider: this.providerName,
          providerChargeId: result.providerChargeId,
          // ✅ removed redirectUrl — not in schema
          metadata: result.rawResponse as any,
        },
        update: {
          providerChargeId: result.providerChargeId,
          status: 'PENDING',
          metadata: result.rawResponse as any,
        },
      });

      return {
        chargeId: result.providerChargeId,
        paymentUrl: result.paymentUrl,
        amount: input.amount,
        currency: input.currency,
        provider: this.providerName,
      };
    } catch (err: any) {
      this.logger.error(`createCharge failed: ${err.message}`);
      throw new InternalServerErrorException(err.message);
    }
  }

  // ── Verify Charge ──────────────────────────────────────────────
  async verifyCharge(chargeId: string, patientId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerChargeId: chargeId },
      include: { booking: { include: { slot: true } } },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.patientId !== patientId) throw new BadRequestException('Access denied');
    if (payment.status === 'CAPTURED') {
      return { success: true, status: 'CAPTURED', bookingId: payment.bookingId };
    }

    const result = await this.provider.verifyCharge(chargeId);

    if (result.status === 'captured') {
      await this.handleSuccessfulPayment(payment.bookingId, chargeId, result.paymentMethod, result.rawResponse);
      return { success: true, status: 'CAPTURED', bookingId: payment.bookingId };
    }

    if (result.status === 'failed') {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', metadata: result.rawResponse },
      });
      return { success: false, status: 'FAILED', bookingId: payment.bookingId };
    }

    return { success: false, status: 'PENDING', bookingId: payment.bookingId };
  }

  // ── Handle Successful Payment (shared by verify + webhook) ─────
  async handleSuccessfulPayment(
    bookingId: string,
    chargeId: string,
    paymentMethod: string | undefined,
    rawResponse: any,
  ) {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
      include: { booking: { include: { slot: true } } },
    });

    if (!payment) return;
    if (payment.status === 'CAPTURED') {
      this.logger.log(`Payment ${chargeId} already captured — skipping`);
      return;
    }

    await this.prisma.$transaction(async tx => {
      await tx.payment.update({
        where: { bookingId },
        data: {
          status: 'CAPTURED',
          paymentMethod: paymentMethod || 'card',
          metadata: rawResponse,
        },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          paidAt: new Date(),
          totalAmount: payment.amount,
        },
      });

      await tx.slot.update({
        where: { id: payment.booking.slotId },
        data: { isBooked: true },
      });

      const wallet = await tx.wallet.findUnique({
        where: { userId: payment.patientId },
      });

      if (wallet) {
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'DEBIT',
            category: 'SESSION',
            title: 'Session Payment',
            subtitle: `Booking confirmed`,
            amount: -payment.amount,
            status: 'COMPLETED',
          },
        });

        await tx.reward.updateMany({
          where: { wallet: { userId: payment.patientId } },
          data: { points: { increment: Math.floor(payment.amount) } },
        });
      }
    });

    this.logger.log(`✅ Payment captured: booking=${bookingId} amount=${payment.amount}`);
  }

  // ── Webhook ────────────────────────────────────────────────────
  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: any;
    try {
      event = this.provider.verifyWebhook(rawBody, signature);
    } catch (err: any) {
      this.logger.warn(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    const eventType = this.provider.extractEventType(event);
    const chargeId = this.provider.extractChargeId(event);

    this.logger.log(`Webhook [${this.providerName}]: ${eventType} — ${chargeId}`);

    if (eventType === 'captured') {
      const payment = await this.prisma.payment.findFirst({
        where: { providerChargeId: chargeId },
      });
      if (payment) {
        await this.handleSuccessfulPayment(payment.bookingId, chargeId, undefined, event);
      }
    }

    if (eventType === 'failed') {
      await this.prisma.payment.updateMany({
        where: { providerChargeId: chargeId },
        data: { status: 'FAILED', metadata: event },
      });
    }

    if (eventType === 'refunded') {
      await this.prisma.payment.updateMany({
        where: { providerChargeId: chargeId },
        data: { status: 'REFUNDED', metadata: event },
      });
    }

    return { received: true };
  }

  // ── Refund ─────────────────────────────────────────────────────
  async refund(bookingId: string, patientId: string, reason: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
      include: { booking: true },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.patientId !== patientId) throw new BadRequestException('Access denied');
    if (payment.status !== 'CAPTURED') throw new BadRequestException('Only captured payments can be refunded');

    const result = await this.provider.refund(
      payment.providerChargeId!,
      payment.amount,
      payment.currency,
    );

    await this.prisma.$transaction(async tx => {
      await tx.payment.update({
        where: { bookingId },
        data: {
          status: 'REFUNDED',
          providerRefundId: result.providerRefundId,
          metadata: result.rawResponse,
        },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      });

      await tx.slot.update({
        where: { id: payment.booking.slotId },
        data: { isBooked: false },
      });

      const wallet = await tx.wallet.findUnique({ where: { userId: patientId } });
      if (wallet) {
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'CREDIT',
            category: 'OTHER',
            title: 'Refund',
            subtitle: `Booking refunded — ${payment.amount} ${payment.currency}`,
            amount: payment.amount,
            status: 'COMPLETED',
          },
        });
      }
    });

    return { refunded: true, amount: payment.amount, currency: payment.currency };
  }

  // ── Get Status ─────────────────────────────────────────────────
  async getPaymentStatus(bookingId: string, patientId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.patientId !== patientId) throw new BadRequestException('Access denied');

    return {
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      provider: payment.provider,
      paymentMethod: payment.paymentMethod,
      providerChargeId: payment.providerChargeId,
      createdAt: payment.createdAt,
    };
  }
}