// src/doctors/doctors.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  // GET /doctors  — public, no auth required
  @Get()
  getAll() {
    return this.doctorsService.getAllDoctors();
  }
}