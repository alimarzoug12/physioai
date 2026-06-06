import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { MailService } from './mail.service';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private prisma: PrismaService,
    private mail:   MailService,
  ) {}

  // ── Runs every day at 8:00 AM ─────────────────────────────────
  @Cron('0 8 * * *')
  async sendDailyReminders() {
    this.logger.log('Running 24h session reminder job...');

    const now       = new Date();
    const tomorrow  = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find all sessions scheduled for tomorrow
    const tomorrowStart = new Date(tomorrow);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const bookings = await this.prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PENDING'] },
        slot: {
          date: {
            gte: tomorrowStart,
            lte: tomorrowEnd,
          },
        },
      },
      include: {
        slot:   true,
        doctor: {
          include: {
            user:   true,
            center: true,
          },
        },
        patient: true,
      },
    });

    this.logger.log(`Found ${bookings.length} sessions scheduled for tomorrow`);

    let sent = 0;
    for (const booking of bookings) {
      try {
        await this.mail.sendSessionReminder({
          patientName:   booking.patient.fullName,
          patientEmail:  booking.patient.email,
          doctorName:    booking.doctor.user.fullName,
          specialty:     booking.doctor.specialties[0] ?? 'Physiotherapy',
          sessionDate:   booking.slot.date.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
          }),
          sessionTime:   booking.slot.startTime,
          sessionType:   booking.sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic Visit',
          centerName:    booking.doctor.center?.name    ?? '',
          centerAddress: booking.doctor.center?.address ?? '',
          bookingId:     booking.id,
        });
        sent++;
      } catch (err: any) {
        this.logger.error(
          `Failed to send reminder for booking ${booking.id}: ${err.message}`,
        );
      }
    }

    this.logger.log(`✅ Sent ${sent}/${bookings.length} reminder emails`);
  }
}