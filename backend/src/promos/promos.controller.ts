import { Controller, Get, Query } from '@nestjs/common';
import { PromosService } from './promos.service';

@Controller('promos')
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @Get('validate')
  validate(@Query('code') code: string) {
    return this.promosService.validate(code);
  }
}