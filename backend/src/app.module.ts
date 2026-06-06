import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { WalletModule } from './wallet/wallet.module';
import { ChatModule } from './chat/chat.module';
import { BookingsModule } from './bookings/bookings.module';
import { PromosModule } from './promos/promos.module';
import { MailModule } from './mail/mail.module';
import { PrismaService } from './prisma.service';
import { TokenCleanupService } from './auth/token-cleanup.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SessionsModule } from './sessions/sessions.module';
import { ProviderDashboardModule } from './provider-dashboard/provider-dashboard.module';
import { PaymentsModule } from './payments/payments.module';
import { SlotsModule } from './slots/slots.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UploadsModule } from './uploads/uploads.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:     [configuration],
    }),

    ThrottlerModule.forRoot([{
      ttl:   60000,
      limit: 100,
    }]),

    ScheduleModule.forRoot(),

    // Feature modules
    MailModule,
    AuthModule,
    DoctorsModule,
    WalletModule,
    ChatModule,
    BookingsModule,
    PromosModule,
    DashboardModule,
    SessionsModule,
    NotificationsModule,
    ProviderDashboardModule,
    PaymentsModule,
    SlotsModule,
    ReviewsModule,
    UploadsModule,
    TransactionsModule,
    AdminModule,
  ],
  // NO AppController, NO AppService here
  providers: [PrismaService, TokenCleanupService],
})
export class AppModule {}