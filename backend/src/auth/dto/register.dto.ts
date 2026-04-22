import {
  IsEmail, IsString, MinLength, MaxLength,
  IsOptional, IsMobilePhone, IsEnum, IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(72, { message: 'Password must not exceed 72 characters' })
  password: string;

  @IsString()
  @MinLength(2,  { message: 'Full name must be at least 2 characters' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  healthProfile?: {
    age?: string;
    gender?: string;
    backPain?: boolean;
    jointPain?: boolean;
    sportsInjury?: boolean;
    neckIssues?: boolean;
    activityLevel?: string;
  };
}