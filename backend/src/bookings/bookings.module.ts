// src/bookings/bookings.module.ts
import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { HomeVisitService } from './dto/home-visit.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:     [NotificationsModule, MailModule],
  controllers: [BookingsController],
  providers:   [BookingsService, HomeVisitService, PrismaService],
  exports:     [BookingsService],
})
export class BookingsModule {}