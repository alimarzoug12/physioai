// src/provider-dashboard/provider-dashboard.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProviderDashboardService } from './provider-dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('provider/dashboard')
@UseGuards(JwtAuthGuard)
export class ProviderDashboardController {
  constructor(private readonly service: ProviderDashboardService) {}

  // GET /provider/dashboard
  @Get()
  getDashboard(@Req() req: any) {
    return this.service.getDashboard(req.user.userId);
  }
}