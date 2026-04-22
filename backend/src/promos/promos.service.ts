import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PromosService {
  constructor(private prisma: PrismaService) {}

  async validate(code: string) {
    const promo = await this.prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo || !promo.isActive) {
      return { valid: false, message: 'Invalid or expired promo code' };
    }
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return { valid: false, message: 'Promo code has expired' };
    }
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return { valid: false, message: 'Promo code usage limit reached' };
    }

    return {
      valid:           true,
      code:            promo.code,
      discountPercent: promo.discountPercent,
      label:           `${promo.discountPercent}% discount`,
    };
  }
}