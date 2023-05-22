import { Weekday } from '@prisma/client';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOpeningHoursDto {
  @ApiProperty({
    enum: Weekday,
  })
  @IsNotEmpty()
  weekday: Weekday;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  startHourUtc: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  endHourUtc: Date;
}
