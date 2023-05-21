import { Weekday } from '@prisma/client';
import { IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOpeningHoursDto {
  @ApiProperty({
    enum: Weekday,
    required: false,
  })
  @IsOptional()
  weekday?: Weekday;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startHourUtc?: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endHourUtc?: Date;
}
