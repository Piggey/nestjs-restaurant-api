import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { MongoService } from '../db/mongo/mongo.service';
import {
  FetchOrderResponse,
  FetchOrdersResponse,
  OrderCreatedResponse,
} from './responses';
import { Order } from './entities/order.entity';
import { OrderStatus } from '@prisma-mongo/prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { PostgresService } from '../db/postgres/postgres.service';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

const RESTAURANT_CLOSING_TIME_OFFSET_HOURS = 1;
const LOYALTY_POINTS_MULTIPLIER = 0.1;
const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

@Injectable()
export class OrderService {
  constructor(
    private readonly mongo: MongoService,
    private readonly postgres: PostgresService,
  ) {}

  async fetchOrders(
    user: User,
    pendingOnly?: boolean,
  ): Promise<FetchOrdersResponse> {
    const orders = await this.mongo.order.findMany({
      where: { userEmail: user.userEmail },
    });

    if (pendingOnly) {
      return { orders: this.filterPendingOnly(orders) };
    }

    return { orders };
  }

  async fetchOrder(id: string, user: User): Promise<FetchOrderResponse> {
    const order = await this.databaseFetchOrder(id);
    if (order.userEmail !== user.userEmail) {
      throw new ForbiddenException();
    }

    return { order };
  }

  async cancelOrder(id: string, user: User): Promise<FetchOrderResponse> {
    const oldOrder = await this.databaseFetchOrder(id);
    if (oldOrder.userEmail !== user.userEmail) {
      throw new ForbiddenException();
    }

    const order = await this.mongo.order.update({
      where: { id },
      data: { status: OrderStatus.CLIENT_CANCELLED },
    });

    return { order };
  }

  async createOrder(
    user: User,
    newOrder: CreateOrderDto,
  ): Promise<OrderCreatedResponse> {
    if (user.userEmail !== newOrder.userEmail) {
      throw new ForbiddenException('oj ty smieszku');
    }

    // make sure restaurant exists
    const restaurant = await this.fetchRestaurant(newOrder.restaurantId);

    // make sure order is placed when restaurant is open
    const currentDateTime = new Date();
    const hours = restaurant.openingHours.find(
      (day) => day.weekday === WEEKDAYS[currentDateTime.getDay()],
    );

    // offset restaurant's closing time
    hours.endHourUtc.setHours(
      hours.endHourUtc.getHours() - RESTAURANT_CLOSING_TIME_OFFSET_HOURS,
    );
    const startHour =
      hours.startHourUtc.getHours() * 100 + hours.startHourUtc.getMinutes();
    const endHour =
      hours.endHourUtc.getHours() * 100 + hours.endHourUtc.getMinutes();
    const currentHour =
      currentDateTime.getHours() * 100 + currentDateTime.getMinutes();

    if (currentHour < startHour || currentHour > endHour) {
      throw new BadRequestException('cannot order when restaurant is closed');
    }

    // calculate loyalty points and update user's db entry
    const loyaltyPointsGained = Math.floor(
      newOrder.totalPrice * LOYALTY_POINTS_MULTIPLIER,
    );

    // place an order
    const order = await this.mongo.order.create({ data: newOrder });

    // update client's lotalty points
    const updatedUser = await this.postgres.user.update({
      where: { userEmail: newOrder.userEmail },
      data: { loyaltyPoints: user.loyaltyPoints + loyaltyPointsGained },
    });

    return { order, user: updatedUser, loyaltyPointsGained };
  }

  async fetchOrdersByRestaurant(
    id: number,
    user: User,
    pendingOnly?: boolean,
  ): Promise<FetchOrdersResponse> {
    // make sure theres a restaurant with given id
    const restaurant = await this.fetchRestaurant(id);

    // make sure employee works in this restaurant
    try {
      await this.postgres.employee.findFirstOrThrow({
        where: {
          user: { userEmail: user.userEmail },
          restaurantId: restaurant.restaurantId,
        },
      });
    } catch (error) {
      throw new ForbiddenException();
    }

    const orders = await this.mongo.order.findMany({
      where: { restaurantId: id },
    });

    // filter pending only if needed
    if (pendingOnly) {
      return { orders: this.filterPendingOnly(orders) };
    }

    return { orders };
  }

  private async fetchRestaurant(id: number): Promise<Restaurant> {
    try {
      const restaurant = await this.postgres.restaurant.findUniqueOrThrow({
        include: { address: true, openingHours: true },
        where: { restaurantId: id },
      });
      return restaurant;
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new NotFoundException(`order ${id} not found`);
      } else {
        err = new HttpException(error.meta.cause, HttpStatus.FAILED_DEPENDENCY);
      }

      Logger.error(err);
      throw err;
    }
  }

  private filterPendingOnly(orders: Order[]): Order[] {
    return orders.filter((order) =>
      [
        OrderStatus.NOT_APPROVED as string,
        OrderStatus.APPROVED as string,
        OrderStatus.IN_PROGRESS as string,
        OrderStatus.DELIVERY as string,
      ].includes(order.status),
    );
  }

  private async databaseFetchOrder(id: string): Promise<Order> {
    let order: Order;
    try {
      order = await this.mongo.order.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new NotFoundException(`order ${id} not found`);
      } else {
        err = new HttpException(error.meta.cause, HttpStatus.FAILED_DEPENDENCY);
      }

      Logger.error(err);
      throw err;
    }

    return order;
  }
}
