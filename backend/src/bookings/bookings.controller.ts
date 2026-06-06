// src/bookings/bookings.controller.ts
import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  create(@Req() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.userId, dto);
  }
  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.getBookingById(id, req.user.userId);
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