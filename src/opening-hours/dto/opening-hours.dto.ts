import { Weekday } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class OpeningHoursDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  openingHoursId: number;
  @ApiProperty({
    enum: Weekday,
    required: false,
  })
  weekday: Weekday;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  startHourUtc: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  endHourUtc: Date;
}
