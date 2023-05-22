import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { MongoService } from '../db/mongo/mongo.service';
import { FetchOrderResponse, FetchOrdersResponse } from './responses';
import { Order } from './entities/order.entity';
import { OrderStatus } from '@prisma-mongo/prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { PostgresService } from '../db/postgres/postgres.service';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

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
  ): Promise<FetchOrderResponse> {
    if (user.userEmail !== newOrder.userEmail) {
      throw new ForbiddenException('oj ty smieszku');
    }

    const order = await this.mongo.order.create({ data: newOrder });
    return { order };
  }

  async fetchOrdersByRestaurant(
    id: number,
    user: User,
    pendingOnly?: boolean,
  ): Promise<FetchOrdersResponse> {
    // make sure theres a restaurant with given id
    let restaurant: Restaurant;
    try {
      restaurant = await this.postgres.restaurant.findUniqueOrThrow({
        where: { restaurantId: id },
      });
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
