import { IsString } from 'class-validator';

export class RescheduleBookingDto {
  @IsString()
  newSlotId: string;
}