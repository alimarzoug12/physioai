import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'doctor-uuid-here', description: 'Doctor ID' })
  @IsString()
  doctorId: string;

  @ApiProperty({ example: 'slot-uuid-here', description: 'Slot ID' })
  @IsString()
  slotId: string;

  @ApiProperty({ example: 'CLINIC', enum: ['CLINIC', 'HOME'], description: 'Session type' })
  @IsIn(['CLINIC', 'HOME_VISIT'])
  sessionType: 'CLINIC' | 'HOME_VISIT';

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsNumber()
  durationMinutes: number;

  @ApiProperty({ example: 'WALLET', description: 'Payment method (WALLET, CASH, CARD)' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ example: 'PROMO10', description: 'Promo code', required: false })
  @IsOptional()
  @IsString()
  promoCode?: string;

  @ApiProperty({ example: 'I have back pain', description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: ['wheelchair access'], description: 'Special requirements', required: false })
  @IsOptional()
  @IsArray()
  requirements?: string[];

  @ApiProperty({ example: 180, description: 'Total amount in QAR' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ example: '123 Al Waab Street, Doha', description: 'Home address for home visits', required: false })
  @IsOptional()
  @IsString()
  homeAddress?: string;

  @ApiProperty({ example: 25.2854, description: 'Latitude for home visit location', required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: 51.5310, description: 'Longitude for home visit location', required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}