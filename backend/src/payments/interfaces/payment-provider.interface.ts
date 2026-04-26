export interface CreateChargeInput {
  bookingId:     string;
  amount:        number;
  currency:      string;
  patientEmail:  string;
  patientName:   string;
  patientPhone?: string;
  description:   string;
  redirectUrl:   string;
  metadata?:     Record<string, string>;
}

export interface ChargeResult {
  providerChargeId: string;
  status:           'pending' | 'captured' | 'failed';
  paymentUrl:       string | null;
  rawResponse:      any;
}

export interface VerifyResult {
  providerChargeId: string;
  status:           'captured' | 'pending' | 'failed';
  paymentMethod?:   string;
  rawResponse:      any;
}

export interface RefundResult {
  providerRefundId: string;
  status:           'refunded';
  rawResponse:      any;
}

export interface IPaymentProvider {
  createCharge(input: CreateChargeInput):                            Promise<ChargeResult>;
  verifyCharge(chargeId: string):                                    Promise<VerifyResult>;
  refund(chargeId: string, amount: number, currency: string):        Promise<RefundResult>;
  verifyWebhook(rawBody: Buffer, signature: string):                 any;           // ✅ 'any' not Stripe.Event
  extractEventType(event: any): 'captured' | 'failed' | 'refunded' | 'unknown';
  extractChargeId(event: any):  string;
}