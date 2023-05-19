import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FetchRestaurantResponse, FetchRestaurantsResponse } from './responses';
import { PostgresService } from '../db/postgres/postgres.service';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(private readonly db: PostgresService) {}

  async fetchRestaurants(): Promise<FetchRestaurantsResponse> {
    const restaurants = await this.db.restaurant.findMany({
      include: { address: true, openingHours: true },
      where: { available: true },
    });

    return {
      restaurantsAvailable: restaurants.length,
      restaurants,
    };
  }

  async fetchRestaurant(id: number): Promise<FetchRestaurantResponse> {
    let restaurant: Restaurant;
    try {
      restaurant = await this.db.restaurant.findFirstOrThrow({
        include: { address: true, openingHours: true },
        where: { restaurantId: id, available: true },
      });
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new NotFoundException(`could not find restaurant with id ${id}`);
      } else {
        err = new HttpException(error.meta.cause, HttpStatus.FAILED_DEPENDENCY);
      }

      Logger.error(err);
      throw err;
    }

    return { restaurant };
  }
}
