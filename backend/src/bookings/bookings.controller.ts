// src/bookings/bookings.controller.ts
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.userId, dto);
  }
  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.getBookingById(id, req.user.userId);
  }
}