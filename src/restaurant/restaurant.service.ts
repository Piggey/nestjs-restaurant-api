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
import { RestaurantsInRangeDto } from './dto/restaurants-in-range.dto';
import { CreateOpeningHoursDto } from '../opening-hours/dto/create-opening-hours.dto';

@Injectable()
export class RestaurantService {
  constructor(private readonly db: PostgresService) {}

  async fetchRestaurants(
    inRangeDto?: RestaurantsInRangeDto,
  ): Promise<FetchRestaurantsResponse> {
    const restaurants = await this.db.restaurant.findMany({
      include: { address: true, openingHours: true },
      where: { available: true },
    });

    if (!inRangeDto) {
      return {
        restaurantsAvailable: restaurants.length,
        restaurants,
      };
    }

    const restaurantsInRange = restaurants.filter((r) => {
      const d = this.haversineDistance(
        inRangeDto.userLat,
        inRangeDto.userLon,
        r.geoLat,
        r.geoLon,
      );

      return d <= inRangeDto.rangeKm;
    });

    return {
      restaurantsAvailable: restaurantsInRange.length,
      restaurants: restaurantsInRange,
    };
  }

  async fetchRestaurant(id: string): Promise<FetchRestaurantResponse> {
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
      const openingHoursPretty = this.createOpeningHoursPrettyString(
        newRestaurant.openingHours.create,
      );

      const restaurant = await this.db.restaurant.create({
        include: { address: true, openingHours: true },
        data: { openingHoursPretty, ...newRestaurant },
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
    id: string,
    newRestaurant: UpdateRestaurantDto,
  ): Promise<RestaurantUpdatedResponse> {
    try {
      let restaurant = await this.db.restaurant.update({
        include: { address: true, openingHours: true },
        where: { restaurantId: id },
        data: newRestaurant,
      });

      // update pretty string if opening hours changed
      if (newRestaurant.openingHours) {
        const openingHoursPretty = this.createOpeningHoursPrettyString(
          restaurant.openingHours as CreateOpeningHoursDto[],
        );

        restaurant = await this.db.restaurant.update({
          include: { address: true, openingHours: true },
          where: { restaurantId: id },
          data: { openingHoursPretty },
        });
      }

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

  async deleteRestaurant(id: string): Promise<RestaurantDeletedResponse> {
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

  private createOpeningHoursPrettyString(
    openingHours: CreateOpeningHoursDto[],
  ): string | null {
    if (openingHours.length === 0) {
      return null;
    }

    const groupedHours: { [key: string]: CreateOpeningHoursDto[] } = {};
    for (const hour of openingHours) {
      const key = `${hour.startHourUtc}-${hour.endHourUtc}`;
      if (groupedHours[key]) {
        groupedHours[key].push(hour);
      } else {
        groupedHours[key] = [hour];
      }
    }

    let result = '';
    for (const key in groupedHours) {
      const hours = groupedHours[key];
      const startHourUtc = new Date(hours[0].startHourUtc);
      const endHourUtc = new Date(hours[0].endHourUtc);
      const start = `${startHourUtc.getHours()}:${startHourUtc
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      const end = `${endHourUtc.getHours()}:${endHourUtc
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      if (hours.length === 1) {
        result += `${hours[0].weekday}: ${start} - ${end}`;
      } else {
        const firstDay = hours[0].weekday;
        const lastDay = hours[hours.length - 1].weekday;
        result += `${firstDay} - ${lastDay}: ${start} - ${end}`;
      }

      result += ',';
    }

    return result.substring(0, result.length - 1);
  }

  private haversineDistance(
    uLat: number,
    uLon: number,
    rLat: number,
    rLon: number,
  ): number {
    // https://en.wikipedia.org/wiki/Haversine_formula
    const EARTH_RADIUS_KM = 6371;

    const dLat = degreesToRadians(rLat - uLat);
    const dLon = degreesToRadians(rLon - uLon);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(uLat)) *
        Math.cos(degreesToRadians(rLat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;

    function degreesToRadians(degrees: number): number {
      return degrees * (Math.PI / 180);
    }
  }
}
