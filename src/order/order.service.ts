import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  MethodNotAllowedException,
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
    const order = await this.mongo.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`could not find order with id ${id}`);
    }

    if (order.userEmail !== user.userEmail) {
      throw new ForbiddenException();
    }

    return { order };
  }

  async cancelOrder(id: string, user: User): Promise<FetchOrderResponse> {
    const oldOrder = await this.mongo.order.findUnique({ where: { id } });
    if (!oldOrder) {
      throw new NotFoundException(`could not find order with id ${id}`);
    }

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
    const restaurant = await this.postgres.restaurant.findUnique({
      include: { openingHours: true },
      where: { restaurantId: newOrder.restaurantId },
    });
    if (!restaurant) {
      throw new NotFoundException(
        `could not find restaurant with id ${newOrder.restaurantId}`,
      );
    }

    // make sure order is placed some time before closing time
    const currentDateTime = new Date();
    const hours = restaurant.openingHours.find(
      (day) => day.weekday === WEEKDAYS[currentDateTime.getUTCDay()],
    );
    if (!hours) {
      throw new MethodNotAllowedException(
        `restaurant does not have opening hours data on ${
          WEEKDAYS[currentDateTime.getUTCDay()]
        }`,
      );
    }

    // offset restaurant's closing time
    hours.endHourUtc.setUTCHours(
      hours.endHourUtc.getUTCHours() - RESTAURANT_CLOSING_TIME_OFFSET_HOURS,
    );
    const startHour =
      hours.startHourUtc.getUTCHours() * 100 +
      hours.startHourUtc.getUTCMinutes();
    const endHour =
      hours.endHourUtc.getUTCHours() * 100 + hours.endHourUtc.getUTCMinutes();
    const currentHour =
      currentDateTime.getUTCHours() * 100 + currentDateTime.getUTCMinutes();

    if (currentHour < startHour || currentHour > endHour) {
      throw new MethodNotAllowedException(
        `cannot order ${RESTAURANT_CLOSING_TIME_OFFSET_HOURS} hour(s) before closing time.` +
          `tried to order: ${currentHour}, restaurant opening hours: ${startHour} - ${endHour}`,
      );
    }

    // calculate loyalty points and update user's db entry
    const loyaltyPointsGained = Math.floor(
      newOrder.totalPrice * LOYALTY_POINTS_MULTIPLIER,
    );

    // place an order
    let order;
    try {
      order = await this.mongo.order.create({ data: newOrder });
    } catch (error) {
      const err = new HttpException(
        'error creating new order',
        HttpStatus.FAILED_DEPENDENCY,
      );
      Logger.error(err);
      throw err;
    }

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
    const restaurant = await this.postgres.restaurant.findUnique({
      where: { restaurantId: id },
    });
    if (!restaurant) {
      throw new NotFoundException(`could not find restaurant ${id}`);
    }

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
    const order = await this.mongo.order.findUnique({
      where: { id: updateStatusDto.id },
    });
    if (!order) {
      throw new NotFoundException(`could not find order ${updateStatusDto.id}`);
    }
    const restaurant = await this.postgres.restaurant.findUnique({
      where: { restaurantId: order.restaurantId },
    });
    if (!restaurant) {
      throw new NotFoundException(
        `could not find restaurant ${order.restaurantId}`,
      );
    }

    // make sure employee works in this restaurant
    if (!(await this.employeeWorksInRestaurant(user, restaurant))) {
      throw new ForbiddenException(
        `employee ${user.userId} does not work at restaurant ${restaurant.restaurantId}`,
      );
    }

    // make sure we dont update status backwards
    if (
      OrderStatusLevel[updateStatusDto.status] < OrderStatusLevel[order.status]
    ) {
      throw new BadRequestException(
        `cannot change order status (${order.status} -> ${updateStatusDto.status})`,
      );
    }

    // update status
    try {
      const newOrder = await this.mongo.order.update({
        where: { id: updateStatusDto.id },
        data: { status: updateStatusDto.status },
      });
      return { order: newOrder };
    } catch (error) {
      throw new HttpException(
        'error updating order status',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }

  private async employeeWorksInRestaurant(
    user: User,
    restaurant: Restaurant,
  ): Promise<boolean> {
    if (user.userRole === 'BOSS') {
      return true;
    }

    const employee = await this.postgres.employee.findFirst({
      where: {
        user: { userEmail: user.userEmail },
        restaurantId: restaurant.restaurantId,
      },
    });

    return !!employee;
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
}
