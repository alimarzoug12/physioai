// src/doctors/doctors.controller.ts
import { Controller, Get, Param, UseGuards, Request, Query, Req, BadRequestException } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MatchingService } from './matching.service';

@Controller('doctors')
export class DoctorsController {
  // matchingService: any;
  constructor(private readonly doctorsService: DoctorsService, private readonly matchingService: MatchingService,) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: any) {
    return this.doctorsService.getDoctorMe(req.user.userId);
  }

  // GET /doctors
  @Get()
  getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.doctorsService.getAllDoctors(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  getRecommended(
    @Req() req: any,
    @Query('limit') limit?: string,
  ) {
    return this.matchingService.getRecommendedDoctors(
      req.user.userId,
      limit ? parseInt(limit, 10) : 10,
    );
  }


  @Get()
  findAll(
    @Query('specialty') specialty?: string,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('rating') rating?: string,
    @Query('language') language?: string,
    @Query('available') available?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.doctorsService.getAllDoctors(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      {
        search,
        specialty,
        city,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        rating: rating ? parseFloat(rating) : undefined,
        language,
        available: available === 'true',
        sortBy,
      }
    );
  }

  // GET /doctors/filter-options — for populating dropdowns
  @Get('filter-options')
  getFilterOptions() {
    return this.doctorsService.getFilterOptions();
  }

  // GET /doctors/:id  ← used by BookSession to load doctor info
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.doctorsService.getDoctorById(id);
  }

  // GET /doctors/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }


  @Get(':id/slots')
  getSlotsForDate(
    @Param('id') id: string,
    @Query('date') date: string,   // ISO date string: "2024-11-04"
  ) {
    return this.doctorsService.getSlotsForDate(id, date);
  }

  // GET /doctors/:id/slots?date=
  @Get(':id/slots')
  getSlots(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    return this.doctorsService.getSlotsForDate(id, date);
  }

  @Get('nearby')
  findNearby(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('radius') radius = '5',
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('specialty') specialty?: string,
  ) {
    if (!lat || !lon) {
      throw new BadRequestException('lat and lon are required');
    }
    return this.doctorsService.findNearby({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      radiusKm: parseFloat(radius),
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      specialty,
    });
  }
}