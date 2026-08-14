// src/bookings/bookings.controller.ts
import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('bookings')
@ApiBearerAuth('JWT-auth')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  @Post()
  create(@Req() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.userId, dto);
  }

  @Get('pending')
  getPending(@Req() req: any) {
    return this.bookingsService.getPendingBookingsForDoctor(req.user.userId);
  }

  @Get()
  getAll(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingsService.getAllBookings(
      req.user.userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.getBookingById(id, req.user.userId);
  }

  // GET /bookings/:id/policy — preview cancellation policy before cancelling
  @Get(':id/policy')
  getPolicy(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.getCancellationPolicy(id, req.user.userId);
  }

  // PATCH /bookings/:id/cancel — cancel a booking
  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelBooking(id, req.user.userId, dto);
  }

  // PATCH /bookings/:id/reschedule — move to new slot
  @Patch(':id/reschedule')
  reschedule(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: RescheduleBookingDto,
  ) {
    return this.bookingsService.rescheduleBooking(id, req.user.userId, dto);
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.confirmBookingByDoctor(id, req.user.userId);
  }

  // ✅ NEW — doctor rejects a pending booking
  @Patch(':id/reject')
  reject(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { reason?: string },
  ) {
    return this.bookingsService.rejectBookingByDoctor(id, req.user.userId, body?.reason);
  }

  // POST /bookings/estimate-travel-fee
  @Post('estimate-travel-fee')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  estimateTravelFee(
    @Body() body: {
      doctorId: string;
      latitude: number;
      longitude: number;
    },
  ) {
    return this.bookingsService.estimateTravelFee(
      body.doctorId,
      body.latitude,
      body.longitude,
    );
  } 

}