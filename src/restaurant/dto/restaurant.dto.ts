import { ApiProperty } from '@nestjs/swagger';

export class RestaurantDto {
  @ApiProperty({
    required: false,
  })
  restaurantId: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  available: boolean;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  geoLat: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  geoLon: number;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  openingHoursPretty: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  photoUrl: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  phoneNumber: string | null;
}
