// src/doctors/doctors.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

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
}