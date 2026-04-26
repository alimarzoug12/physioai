import { apiFetch } from './auth';

const FRONTEND_URL = window.location.origin;

export const paymentsApi = {
  createCharge: (dto: {
    bookingId:   string;
    amount:      number;
    currency?:   string;
    description: string;
  }) =>
    apiFetch<{
      chargeId:   string;
      paymentUrl: string | null;
      amount:     number;
      currency:   string;
      provider:   string;
    }>('/payments/charge', {
      method: 'POST',
      body:   JSON.stringify({
        ...dto,
        currency:    dto.currency || 'QAR',
        redirectUrl: `${FRONTEND_URL}/payment/callback`,
      }),
    }),

  verifyCharge: (chargeId: string) =>
    apiFetch<{ success: boolean; status: string; bookingId: string }>(
      `/payments/verify/${chargeId}`,
      { method: 'POST' },
    ),

  getStatus: (bookingId: string) =>
    apiFetch<any>(`/payments/status/${bookingId}`),

  refund: (bookingId: string, reason?: string) =>
    apiFetch<{ refunded: boolean; amount: number; currency: string }>(
      `/payments/refund/${bookingId}`,
      { method: 'POST', body: JSON.stringify({ reason }) },
    ),
};