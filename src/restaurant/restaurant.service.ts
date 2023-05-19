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

