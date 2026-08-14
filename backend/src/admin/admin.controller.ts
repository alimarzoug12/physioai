import {
  Body, Controller, Delete, Get, Param,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from './admin-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // ── Dashboard ──────────────────────────────────────────────────
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardSummary();
  }

  // ── Users ──────────────────────────────────────────────────────
  @Get('users')
  getUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getAllUsers(
      page  ? parseInt(page,  10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Patch('users/:id/ban')
  banUser(@Param('id') id: string) {
    return this.adminService.banUser(id);
  }

  // ── Doctors ────────────────────────────────────────────────────
  @Get('doctors')
  getDoctors(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('approved') approved?: string,
  ) {
    return this.adminService.getAllDoctors(
      page  ? parseInt(page,  10) : 1,
      limit ? parseInt(limit, 10) : 20,
      approved,
    );
  }

  @Patch('doctors/:id/approve')
  approveDoctor(@Param('id') id: string) {
    return this.adminService.approveDoctor(id);
  }

  @Patch('doctors/:id/reject')
  rejectDoctor(@Param('id') id: string) {
    return this.adminService.rejectDoctor(id);
  }

  // ── Bookings ───────────────────────────────────────────────────
  @Get('bookings')
  getBookings(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllBookings(
      page  ? parseInt(page,  10) : 1,
      limit ? parseInt(limit, 10) : 20,
      status,
    );
  }

  // ── Promo Codes ────────────────────────────────────────────────
  @Get('promos')
  getPromos() {
    return this.adminService.getAllPromoCodes();
  }

  @Post('promos')
  createPromo(@Body() body: { code: string; discountPercent: number; usageLimit?: number; expiresAt?: string }) {
    return this.adminService.createPromoCode(body);
  }

  @Patch('promos/:id/deactivate')
  deactivatePromo(@Param('id') id: string) {
    return this.adminService.deactivatePromoCode(id);
  }

  @Delete('promos/:id')
  deletePromo(@Param('id') id: string) {
    return this.adminService.deletePromoCode(id);
  }

  // ── Revenue Analytics ──────────────────────────────────────────
  @Get('analytics/revenue')
  getRevenue() {
    return this.adminService.getRevenueAnalytics();
  }

  // ── Dashboard sub-endpoints (called by PhysioAIDashboard.tsx) ──
  @Get('recent-bookings')
  getRecentBookings() {
    return this.adminService.getRecentBookings();
  }

  @Get('top-doctors')
  getTopDoctors() {
    return this.adminService.getTopDoctors();
  }

  @Get('specialty-breakdown')
  getSpecialtyBreakdown() {
    return this.adminService.getSpecialtyBreakdown();
  }

  @Get('revenue-trend')
  getRevenueTrend() {
    return this.adminService.getRevenueTrend();
  }

  @Get('booking-trend')
  getBookingTrend() {
    return this.adminService.getBookingTrend();
  }

  @Get('patient-stats')
  getPatientStats() {
    return this.adminService.getPatientStats();
  }

  @Get('ai-stats')
  getAiStats() {
    return this.adminService.getAiStats();
  }
}