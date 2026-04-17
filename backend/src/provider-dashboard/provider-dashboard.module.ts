// src/provider-dashboard/provider-dashboard.module.ts
import { Module } from '@nestjs/common';
import { ProviderDashboardController } from './provider-dashboard.controller';
import { ProviderDashboardService } from './provider-dashboard.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProviderDashboardController],
  providers:   [ProviderDashboardService, PrismaService],
})
export class ProviderDashboardModule {}