import {
  Body, Controller, Delete, Get, Param,
  Patch, Post, Query, Req, UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from './admin-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)   // ALL routes require ADMIN role
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // GET /admin/dashboard
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardSummary();
  }

  // ── Users ──────────────────────────────────────────────────────
  // GET /admin/users?page=1&limit=20
  @Get('users')
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllUsers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  // PATCH /admin/users/:id/ban
  @Patch('users/:id/ban')
  banUser(@Param('id') id: string) {
    return this.adminService.banUser(id);
  }

  // ── Doctors ────────────────────────────────────────────────────
  // GET /admin/doctors?page=1&limit=20&approved=false
  @Get('doctors')
  getDoctors(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('approved') approved?: string,
  ) {
    return this.adminService.getAllDoctors(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      approved,
    );
  }

  // PATCH /admin/doctors/:id/approve
  @Patch('doctors/:id/approve')
  approveDoctor(@Param('id') id: string) {
    return this.adminService.approveDoctor(id);
  }

  // PATCH /admin/doctors/:id/reject
  @Patch('doctors/:id/reject')
  rejectDoctor(@Param('id') id: string) {
    return this.adminService.rejectDoctor(id);
  }

  // ── Bookings ───────────────────────────────────────────────────
  // GET /admin/bookings?page=1&limit=20&status=CONFIRMED
  @Get('bookings')
  getBookings(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllBookings(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      status,
    );
  }

  // ── Promo Codes ────────────────────────────────────────────────
  // GET /admin/promos
  @Get('promos')
  getPromos() {
    return this.adminService.getAllPromoCodes();
  }

  // POST /admin/promos
  @Post('promos')
  createPromo(
    @Body() body: {
      code: string;
      discountPercent: number;
      usageLimit?: number;
      expiresAt?: string;
    },
  ) {
    return this.adminService.createPromoCode(body);
  }

  // PATCH /admin/promos/:id/deactivate
  @Patch('promos/:id/deactivate')
  deactivatePromo(@Param('id') id: string) {
    return this.adminService.deactivatePromoCode(id);
  }

  // DELETE /admin/promos/:id
  @Delete('promos/:id')
  deletePromo(@Param('id') id: string) {
    return this.adminService.deletePromoCode(id);
  }

  // ── Revenue Analytics ──────────────────────────────────────────
  // GET /admin/analytics/revenue
  @Get('analytics/revenue')
  getRevenue() {
    return this.adminService.getRevenueAnalytics();
  }
}