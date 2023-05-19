import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../entities/restaurant.entity';

export class RestaurantUpdatedResponse {
  @ApiProperty()
  restaurant: Restaurant;
}
