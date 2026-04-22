// src/doctors/doctors.controller.ts
import { Controller, Get, Param, UseGuards, Request, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: any) {
    return this.doctorsService.getDoctorMe(req.user.userId);
  }
  
  // GET /doctors
  @Get()
  getAll() {
    return this.doctorsService.getAllDoctors();
  }

  // GET /doctors/:id  ← used by BookSession to load doctor info
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.doctorsService.getDoctorById(id);
  }

  @Get(':id/slots')
  getSlotsForDate(
    @Param('id') id: string,
    @Query('date') date: string,   // ISO date string: "2024-11-04"
  ) {
    return this.doctorsService.getSlotsForDate(id, date);
  }

}