import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeProvider } from './providers/stripe.provider';
import { TapProvider } from './providers/tap.provider';
import { PrismaService } from '../prisma.service';

@Module({
  imports:     [ConfigModule],
  controllers: [PaymentsController],
  providers:   [PaymentsService, StripeProvider, TapProvider, PrismaService],
  exports:     [PaymentsService],
})
export class PaymentsModule {}