// src/slots/slots.controller.ts
import {
  Controller, Get, Post, Delete, Patch,
  Param, Body, Query, Req, UseGuards, HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SlotsService }  from './slots.service';

@Controller('slots')
@UseGuards(JwtAuthGuard)
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  // GET /slots/my-schedule?month=2025-05
  @Get('my-schedule')
  getMySchedule(@Req() req: any, @Query('month') month?: string) {
    return this.slotsService.getMySchedule(req.user.userId, month);
  }

  // POST /slots/bulk
  @Post('bulk')
  @HttpCode(201)
  bulkCreate(
    @Req() req: any,
    @Body() body: {
      daysOfWeek: number[]; startTime: string;
      durationMinutes: number; startDate: string; endDate: string;
    },
  ) {
    return this.slotsService.bulkCreate(req.user.userId, body);
  }

  // DELETE /slots/day?date=2025-05-10   ← BEFORE /:id so "day" isn't treated as an id
  @Delete('day')
  @HttpCode(200)
  deleteDaySlots(@Req() req: any, @Query('date') date: string) {
    return this.slotsService.deleteDaySlots(req.user.userId, date);
  }

  // PATCH /slots/:id
  @Patch(':id')
  @HttpCode(200)
  updateSlot(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { isBlocked?: boolean },
  ) {
    return this.slotsService.updateSlot(req.user.userId, id, body);
  }

  // DELETE /slots/:id
  @Delete(':id')
  @HttpCode(200)
  deleteSlot(@Req() req: any, @Param('id') id: string) {
    return this.slotsService.deleteSlot(req.user.userId, id);
  }
}