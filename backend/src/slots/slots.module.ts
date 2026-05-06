// src/slots/slots.module.ts
import { Module }          from '@nestjs/common';
import { SlotsController } from './slots.controller';
import { SlotsService }    from './slots.service';
import { PrismaService }   from '../prisma.service';

@Module({
  controllers: [SlotsController],
  providers:   [SlotsService, PrismaService],
  exports:     [SlotsService],
})
export class SlotsModule {}