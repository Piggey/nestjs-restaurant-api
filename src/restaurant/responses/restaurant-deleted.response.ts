import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../entities/restaurant.entity';

export class RestaurantDeletedResponse {
  @ApiProperty()
  restaurant: Restaurant;

  @ApiProperty()
  firedEmployeesCount: number;
}
