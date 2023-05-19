import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  FetchRestaurantResponse,
  FetchRestaurantsResponse,
  RestaurantCreatedResponse,
  RestaurantDeletedResponse,
  RestaurantUpdatedResponse,
} from './responses';
import { PostgresService } from '../db/postgres/postgres.service';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

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

  async createRestaurant(
    newRestaurant: CreateRestaurantDto,
  ): Promise<RestaurantCreatedResponse> {
    try {
      const restaurant = await this.db.restaurant.create({
        include: { address: true, openingHours: true },
        data: newRestaurant,
      });
      return { restaurant };
    } catch (error) {
      const err = new HttpException(
        error.meta.cause,
        HttpStatus.FAILED_DEPENDENCY,
      );

      Logger.log(err);
      throw err;
    }
  }

  async updateRestaurant(
    id: number,
    newRestaurant: UpdateRestaurantDto,
  ): Promise<RestaurantUpdatedResponse> {
    try {
      const restaurant = await this.db.restaurant.update({
        include: { address: true, openingHours: true },
        where: { restaurantId: id },
        data: newRestaurant,
      });
      return { restaurant };
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
  }

  async deleteRestaurant(id: number): Promise<RestaurantDeletedResponse> {
    const firedEmployees = await this.db.employee.updateMany({
      where: { restaurantId: id },
      data: { firedAt: Date() },
    });

    try {
      const restaurant = await this.db.restaurant.update({
        include: { address: true, openingHours: true },
        where: { restaurantId: id },
        data: { available: false },
      });
      return { firedEmployeesCount: firedEmployees.count, restaurant };
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
  }
}
