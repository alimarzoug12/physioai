import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async getTransactions(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };

    const [total, transactions] = await Promise.all([
      this.prisma.transaction.count({ where: { walletId: wallet.id } }),
      this.prisma.transaction.findMany({
        where:   { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take:    limit,
      }),
    ]);

    return {
      data: transactions,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}