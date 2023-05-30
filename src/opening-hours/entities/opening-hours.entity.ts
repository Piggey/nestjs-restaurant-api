import { Weekday } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

export class OpeningHours {
  @ApiProperty({
    required: false,
  })
  openingHoursId: string;
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
  @ApiProperty({
    required: false,
  })
  restaurantId: string;
  @ApiProperty({
    required: false,
  })
  restaurant?: Restaurant;
}
