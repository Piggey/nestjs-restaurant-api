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

@Injectable()
export class OrderService {
  constructor(private readonly db: MongoService) {}

  async fetchOrders(
    user: User,
    pendingOnly?: boolean,
  ): Promise<FetchOrdersResponse> {
    const orders = await this.db.order.findMany({
      where: { userEmail: user.userEmail },
    });

    if (pendingOnly) {
      return {
        orders: orders.filter((order) =>
          [
            OrderStatus.NOT_APPROVED as string,
            OrderStatus.APPROVED as string,
            OrderStatus.IN_PROGRESS as string,
            OrderStatus.DELIVERY as string,
          ].includes(order.status),
        ),
      };
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

    const order = await this.db.order.update({
      where: { id },
      data: { status: OrderStatus.CLIENT_CANCELLED },
    });

    return { order };
  }

  private async databaseFetchOrder(id: string): Promise<Order> {
    let order: Order;
    try {
      order = await this.db.order.findUniqueOrThrow({ where: { id } });
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
