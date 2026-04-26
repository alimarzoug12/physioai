import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  Headers,
} from '@nestjs/common';
// ✅ Import Request from express directly — don't use RawBodyRequest from NestJS
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma.service';

// ✅ Define RawBodyRequest locally — avoids the import error
type RawBodyRequest<T> = T & { rawBody?: Buffer };

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService,
    private readonly prisma: PrismaService) {}

  // ── Create charge ────────────────────────────────────────────
  @Post('charge')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async createCharge(
    @Req() req: any,
    @Body()
    body: {
      bookingId:    string;
      amount:       number;
      currency?:    string;
      description:  string;
      redirectUrl?: string;
    },
  ) {
    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:3000';
      // ✅ fetch real user data from DB — JWT only has userId + role
    const user = await this.prisma.user.findUnique({
      where:  { id: req.user.userId },
      select: { email: true, fullName: true },
    });

    if (!user) throw new Error('User not found');

    return this.paymentsService.createCharge({
      bookingId:    body.bookingId,
      amount:       body.amount,
      currency:     body.currency    || 'QAR',
      patientId:    req.user.userId,
      patientEmail: user.email   || '',
      patientName:  user.fullName || 'Patient',
      description:  body.description,
      redirectUrl:
        body.redirectUrl || `${frontendUrl}/payment/callback`,
    });
  }

  // ── Verify charge after redirect ─────────────────────────────
  @Post('verify/:chargeId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  verifyCharge(@Param('chargeId') chargeId: string, @Req() req: any) {
    return this.paymentsService.verifyCharge(chargeId, req.user.userId);
  }

  // ── Get payment status ───────────────────────────────────────
  @Get('status/:bookingId')
  @UseGuards(JwtAuthGuard)
  getStatus(@Param('bookingId') bookingId: string, @Req() req: any) {
    return this.paymentsService.getPaymentStatus(bookingId, req.user.userId);
  }

  // ── Refund ───────────────────────────────────────────────────
  @Post('refund/:bookingId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  refund(
    @Param('bookingId') bookingId: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    return this.paymentsService.refund(
      bookingId,
      req.user.userId,
      reason || 'Cancelled by patient',
    );
  }

  // ── Webhook — no auth (Stripe calls this directly) ───────────
  @Post('webhook')
  @HttpCode(200)
  webhook(
    // ✅ Use the local RawBodyRequest type
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') stripeSignature: string,
    @Headers('hashstring')       tapSignature: string,
  ) {
    // rawBody is populated by NestJS when rawBody: true in main.ts
    const rawBody =
      req.rawBody ||
      Buffer.from(
        typeof req.body === 'string'
          ? req.body
          : JSON.stringify(req.body),
      );

    const signature = stripeSignature || tapSignature || '';
    return this.paymentsService.handleWebhook(rawBody, signature);
  }
}