import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  IPaymentProvider,
  CreateChargeInput,
  ChargeResult,
  VerifyResult,
  RefundResult,
} from '../interfaces/payment-provider.interface';

@Injectable()
export class StripeProvider implements IPaymentProvider {
  private readonly stripe: InstanceType<typeof Stripe>;
  private readonly logger = new Logger(StripeProvider.name);
  private readonly webhookSecret: string;

  constructor(private config: ConfigService) {
    const secretKey = this.config.get<string>('payment.stripeSecretKey') || '';

    if (!secretKey) {
      this.logger.warn('STRIPE_SECRET_KEY is not set — payments will fail');
    }

    // ✅ Use the version that matches your installed stripe package
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-04-10' as any,
    });

    this.webhookSecret =
      this.config.get<string>('payment.stripeWebhookSecret') || '';
  }

  // ── Create Checkout Session ──────────────────────────────────
  async createCharge(input: CreateChargeInput): Promise<ChargeResult> {
    this.logger.log(
      `[Stripe] Creating checkout session for booking ${input.bookingId}`,
    );

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode:                 'payment',
      currency:             input.currency.toLowerCase(),
      line_items: [
        {
          price_data: {
            currency:    input.currency.toLowerCase(),
            unit_amount: Math.round(input.amount * 100), // Stripe uses cents
            product_data: {
              name:        input.description,
              description: `PhysioAI — ${input.patientName}`,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: input.patientEmail,
      metadata: {
        bookingId:   input.bookingId,
        patientName: input.patientName,
        ...(input.metadata || {}),
      },
      success_url: `${input.redirectUrl}?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url:  `${input.redirectUrl}?status=cancelled`,
    });

    this.logger.log(`[Stripe] Session created: ${session.id}`);

    return {
      providerChargeId: session.id,
      status:           'pending',
      paymentUrl:       session.url,
      rawResponse:      session,
    };
  }

  // ── Verify Session ───────────────────────────────────────────
  async verifyCharge(sessionId: string): Promise<VerifyResult> {
    this.logger.log(`[Stripe] Verifying session: ${sessionId}`);

    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    // ✅ Type the payment_intent safely without using Stripe namespace types
    const pi = session.payment_intent;
    const paymentMethodType =
      pi && typeof pi !== 'string' && 'payment_method_types' in pi
        ? (pi as any).payment_method_types?.[0]
        : 'card';

    let status: 'captured' | 'pending' | 'failed' = 'pending';
    if (session.payment_status === 'paid') {
      status = 'captured';
    } else if (
      session.payment_status === 'unpaid' &&
      session.status === 'expired'
    ) {
      status = 'failed';
    }

    return {
      providerChargeId: session.id,
      status,
      paymentMethod:    paymentMethodType,
      rawResponse:      session,
    };
  }

  // ── Refund ───────────────────────────────────────────────────
  async refund(
    sessionId: string,
    amount: number,
    _currency: string,
  ): Promise<RefundResult> {
    this.logger.log(`[Stripe] Refunding session: ${sessionId}`);

    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    // ✅ Extract payment intent ID safely
    const pi = session.payment_intent;
    const paymentIntentId =
      typeof pi === 'string' ? pi : pi ? (pi as any).id : null;

    if (!paymentIntentId) {
      throw new Error('No payment intent found for this session');
    }

    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount:         Math.round(amount * 100),
    });

    return {
      providerRefundId: refund.id,
      status:           'refunded',
      rawResponse:      refund,
    };
  }

  // ── Webhook Verification ─────────────────────────────────────
  // ✅ Return 'any' instead of Stripe.Event to avoid type conflicts
  verifyWebhook(rawBody: Buffer, signature: string): any {
    if (!this.webhookSecret) {
      this.logger.warn(
        'STRIPE_WEBHOOK_SECRET not set — skipping signature verification',
      );
      return JSON.parse(rawBody.toString());
    }

    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.webhookSecret,
    );
  }

  // ✅ Accept 'any' instead of Stripe.Event
  extractEventType(
    event: any,
  ): 'captured' | 'failed' | 'refunded' | 'unknown' {
    switch (event.type) {
      case 'checkout.session.completed':
        return 'captured';
      case 'checkout.session.expired':
      case 'payment_intent.payment_failed':
        return 'failed';
      case 'charge.refunded':
        return 'refunded';
      default:
        return 'unknown';
    }
  }

  // ✅ Accept 'any' instead of Stripe.Event
  extractChargeId(event: any): string {
    return event?.data?.object?.id || '';
  }
}