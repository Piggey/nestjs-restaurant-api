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
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

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
const OrderStatusLevel: Record<OrderStatus, number> = {
  NOT_APPROVED: 1,
  APPROVED: 2,
  IN_PROGRESS: 3,
  DELIVERY: 4,
  COMPLETED: 5,
  CLIENT_CANCELLED: 6,
  EMPLOYEE_CANCELLED: 7,
};

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
    const restaurant = await this.databaseFetchRestaurant(
      newOrder.restaurantId,
    );

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
    id: string,
    user: User,
    pendingOnly?: boolean,
  ): Promise<FetchOrdersResponse> {
    // make sure theres a restaurant with given id
    const restaurant = await this.databaseFetchRestaurant(id);

    // make sure employee works in this restaurant
    if (!(await this.employeeWorksInRestaurant(user, restaurant))) {
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

  async updateOrderStatus(
    updateStatusDto: UpdateOrderStatusDto,
    user: User,
  ): Promise<FetchOrderResponse> {
    // make sure restaurant exists
    const order = await this.databaseFetchOrder(updateStatusDto.id);
    const restaurant = await this.databaseFetchRestaurant(order.restaurantId);

    // make sure employee works in this restaurant
    if (!(await this.employeeWorksInRestaurant(user, restaurant))) {
      throw new ForbiddenException();
    }

    // make sure we dont update status backwards
    if (
      OrderStatusLevel[updateStatusDto.status] < OrderStatusLevel[order.status]
    ) {
      throw new BadRequestException('cannot reverse order status');
    }

    // update status
    const newOrder = await this.mongo.order.update({
      where: { id: updateStatusDto.id },
      data: { status: updateStatusDto.status },
    });
    return { order: newOrder };
  }

  private async employeeWorksInRestaurant(
    user: User,
    restaurant: Restaurant,
  ): Promise<boolean> {
    const employee = await this.postgres.employee.findFirstOrThrow({
      where: {
        user: { userEmail: user.userEmail },
        restaurantId: restaurant.restaurantId,
      },
    });

    return !!employee;
  }

  private async databaseFetchRestaurant(id: string): Promise<Restaurant> {
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
    try {
      const order = await this.mongo.order.findUniqueOrThrow({ where: { id } });
      return order;
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
}
