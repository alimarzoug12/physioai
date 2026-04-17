import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SessionsModule } from './sessions/sessions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DoctorsModule } from './doctors/doctors.module';
import { WalletModule } from './wallet/wallet.module';
import { ProviderDashboardModule } from './provider-dashboard/provider-dashboard.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DashboardModule,
    SessionsModule,
    NotificationsModule,
    DoctorsModule,
    WalletModule,
    ProviderDashboardModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}