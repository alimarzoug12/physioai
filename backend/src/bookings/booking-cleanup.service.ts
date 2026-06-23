import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BookingCleanupService {
  private readonly logger = new Logger(BookingCleanupService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupStalePendingBookings() {
    const TEN_MINUTES_AGO = new Date(Date.now() - 10 * 60 * 1000);

    const stale = await this.prisma.booking.findMany({
      where: {
        status: 'PENDING',
        bookedVia: 'AI_AGENT',
        createdAt: { lt: TEN_MINUTES_AGO },
      },
    });

    for (const booking of stale) {
      await this.prisma.slot.update({
        where: { id: booking.slotId },
        data: { isBooked: false },
      });
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'CANCELLED' },
      });
    }

    if (stale.length > 0) {
      this.logger.log(`🧹 Cleaned up ${stale.length} stale pending AI bookings`);
    }
  }
}