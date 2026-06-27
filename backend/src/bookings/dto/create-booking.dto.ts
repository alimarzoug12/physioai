import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  doctorId: string;

  @IsString()
  slotId: string;

  @IsIn(['CLINIC', 'HOME_VISIT'])
  sessionType: 'CLINIC' | 'HOME_VISIT';

  @IsNumber()
  durationMinutes: number;

  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  promoCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  requirements?: string[];

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsString()
  homeAddress?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}