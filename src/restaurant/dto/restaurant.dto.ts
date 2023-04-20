import { ApiProperty } from '@nestjs/swagger';

export class RestaurantDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  restaurantId: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
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
  geoLong: number;
}
