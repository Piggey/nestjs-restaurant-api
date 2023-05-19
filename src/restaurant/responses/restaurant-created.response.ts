import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../entities/restaurant.entity';

export class RestaurantCreatedResponse {
  @ApiProperty()
  restaurant: Restaurant;
}
