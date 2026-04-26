import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import {
  IPaymentProvider, CreateChargeInput, ChargeResult,
  VerifyResult, RefundResult,
} from '../interfaces/payment-provider.interface';

@Injectable()
export class TapProvider implements IPaymentProvider {
  private readonly logger        = new Logger(TapProvider.name);
  private readonly apiUrl        = 'https://api.tap.company/v2';
  private readonly secretKey:    string;
  private readonly webhookSecret: string;

  constructor(private config: ConfigService) {
    this.secretKey     = this.config.get<string>('payment.tapSecretKey')      || '';
    this.webhookSecret = this.config.get<string>('payment.tapWebhookSecret')  || '';
  }

  private async request<T>(method: 'GET' | 'POST', path: string, data?: any): Promise<T> {
    const res = await axios({
      method,
      url:     `${this.apiUrl}${path}`,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      data,
    });
    return res.data;
  }

  async createCharge(input: CreateChargeInput): Promise<ChargeResult> {
    this.logger.log(`[Tap] Creating charge for booking ${input.bookingId}`);

    const charge = await this.request<any>('POST', '/charges', {
      amount:      input.amount,
      currency:    input.currency,
      threeDSecure: true,
      save_card:   false,
      description: input.description,
      metadata:    { bookingId: input.bookingId },
      reference:   { transaction: input.bookingId },
      customer: {
        first_name: input.patientName.split(' ')[0],
        last_name:  input.patientName.split(' ').slice(1).join(' ') || 'Patient',
        email:      input.patientEmail,
      },
      source:   { id: 'src_all' },
      redirect: { url: input.redirectUrl },
    });

    return {
      providerChargeId: charge.id,
      status:           'pending',
      paymentUrl:       charge.transaction?.url || null,
      rawResponse:      charge,
    };
  }

  async verifyCharge(chargeId: string): Promise<VerifyResult> {
    this.logger.log(`[Tap] Verifying charge: ${chargeId}`);
    const charge = await this.request<any>('GET', `/charges/${chargeId}`);

    let status: 'captured' | 'pending' | 'failed' = 'pending';
    if (charge.status === 'CAPTURED') status = 'captured';
    if (['FAILED','DECLINED','CANCELLED','VOID'].includes(charge.status)) status = 'failed';

    return {
      providerChargeId: chargeId,
      status,
      paymentMethod:    charge.source?.payment_method,
      rawResponse:      charge,
    };
  }

  async refund(chargeId: string, amount: number, currency: string): Promise<RefundResult> {
    const refund = await this.request<any>('POST', '/refunds', {
      charge_id:   chargeId,
      amount,
      currency,
      reason:      'Booking cancellation',
    });

    return {
      providerRefundId: refund.id,
      status:           'refunded',
      rawResponse:      refund,
    };
  }

  verifyWebhook(rawBody: Buffer, signature: string): any {
    if (this.webhookSecret) {
      const expected = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex');
      if (expected !== signature) throw new Error('Invalid webhook signature');
    }
    return JSON.parse(rawBody.toString());
  }

  extractEventType(event: any): 'captured' | 'failed' | 'refunded' | 'unknown' {
    if (event.object !== 'charge') return 'unknown';
    if (event.status === 'CAPTURED') return 'captured';
    if (['FAILED','DECLINED','CANCELLED'].includes(event.status)) return 'failed';
    if (event.status === 'REFUNDED') return 'refunded';
    return 'unknown';
  }

  extractChargeId(event: any): string {
    return event.id || '';
  }
}