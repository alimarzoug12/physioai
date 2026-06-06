import { Module, Global } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MailService } from './mail.service';
import { ReminderService } from './reminder.service';
import { PrismaService } from '../prisma.service';

@Global()
@Module({
  imports:   [ScheduleModule.forRoot()],
  providers: [MailService, ReminderService, PrismaService],
  exports:   [MailService],
})
export class MailModule {}