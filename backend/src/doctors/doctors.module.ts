// src/doctors/doctors.module.ts
import { Module } from '@nestjs/common';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { PrismaService } from '../prisma.service';
import { MatchingService } from './matching.service';

@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService, PrismaService, MatchingService],
  exports: [DoctorsService, MatchingService],
})
export class DoctorsModule {}