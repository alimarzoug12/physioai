// src/wallet/wallet.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  // ── Get or auto-create wallet ─────────────────────────────
  private async getOrCreateWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where:   { userId },
      include: { rewards: true },
    });

    // Auto-create wallet if it doesn't exist yet
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          balance:  0,
          currency: 'QAR',
          rewards:  { create: { points: 0 } },
        },
        include: { rewards: true },
      });
    }

    return wallet;
  }

  async getWallet(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    return {
      balance:      wallet.balance,
      currency:     wallet.currency,
      rewardPoints: wallet.rewards?.points ?? 0,
    };
  }

  async getPaymentMethods(userId: string) {
    const methods = await this.prisma.paymentMethod.findMany({
      where:   { userId },
      orderBy: { isDefault: 'desc' },
    });
    return methods.map(m => ({
      id:         m.id,
      type:       m.type,
      label:      m.label,
      sublabel:   m.sublabel,
      last4:      m.last4,
      expiry:     m.expiry,
      holderName: m.holderName,
      provider:   m.provider,
      isDefault:  m.isDefault,
      isVerified: m.isVerified,
    }));
  }

  async getTransactions(userId: string, limit = 10) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return [];

    const txns = await this.prisma.transaction.findMany({
      where:   { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take:    limit,
    });

    return txns.map(t => ({
      id:        t.id,
      type:      t.type,
      category:  t.category,
      title:     t.title,
      subtitle:  t.subtitle,
      amount:    t.amount,
      status:    t.status,
      createdAt: t.createdAt,
    }));
  }

  async getMonthlySpending(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return { categories: [], total: 0 };

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const txns = await this.prisma.transaction.findMany({
      where: {
        walletId:  wallet.id,
        type:      'DEBIT',
        createdAt: { gte: startOfMonth },
        status:    'COMPLETED',
      },
    });

    const grouped: Record<string, number> = {};
    for (const t of txns) {
      grouped[t.category] = (grouped[t.category] ?? 0) + Math.abs(t.amount);
    }

    const labelMap: Record<string, string> = {
      SESSION:        'Physiotherapy',
      HOME_VISIT:     'Home Visits',
      REHABILITATION: 'Rehabilitation',
      OTHER:          'Other',
    };

    const total = Object.values(grouped).reduce((a, b) => a + b, 0);
    const max   = Math.max(...Object.values(grouped), 1);

    const categories = Object.entries(grouped)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, amount]) => ({
        category: cat,
        label:    labelMap[cat] ?? cat,
        amount,
        percent:  Math.round((amount / max) * 100),
      }));

    return { categories, total };
  }
}