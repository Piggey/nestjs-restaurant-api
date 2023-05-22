import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../entities/restaurant.entity';

export class FetchRestaurantsResponse {
  @ApiProperty()
  restaurantsAvailable: number;

  @ApiProperty({ type: [Restaurant] })
  restaurants: Restaurant[];
}
