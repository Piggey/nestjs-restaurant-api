import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../entities/restaurant.entity';

export class RestaurantsInRange {
  @ApiProperty()
  distanceKm: number;

  @ApiProperty()
  restaurant: Restaurant;
}

export class FetchRestaurantsInRangeResponse {
  @ApiProperty()
  restaurantsAvailable: number;

  @ApiProperty({ type: [RestaurantsInRange] })
  restaurants: RestaurantsInRange[];
}
