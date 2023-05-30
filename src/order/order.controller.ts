import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AllowMinRole, UserDecorator } from '../auth/decorator';
import { User } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/guard';
import { UserRoles } from '../auth/model';
import {
  FetchOrderResponse,
  FetchOrdersResponse,
  OrderCreatedResponse,
} from './responses';
import { RequestErrorResponse } from '../app/response';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('order')
@ApiForbiddenResponse({
  description: 'insufficient `UserRoles` privileges. minimum = `CLIENT`',
  type: RequestErrorResponse,
})
@UseGuards(RolesGuard)
@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: "fetch all of client's orders (previous and current)",
  })
  @ApiOkResponse({
    description: 'returns orders',
    type: FetchOrdersResponse,
  })
  @AllowMinRole(UserRoles.CLIENT)
  @Get('/')
  async fetchOrders(@UserDecorator() user: User): Promise<FetchOrdersResponse> {
    this.logger.log(`GET /order, userEmail = ${user.userEmail}`);
    return this.orderService.fetchOrders(user);
  }

  @ApiOperation({ summary: 'fetch order with given id' })
  @ApiOkResponse({
    description: 'returns order info',
    type: FetchOrderResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find an order with given id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when fetching order',
    type: RequestErrorResponse,
  })
  @AllowMinRole(UserRoles.CLIENT)
  @Get(':id')
  async fetchOrder(
    @Param('id') id: string,
    @UserDecorator() user: User,
  ): Promise<FetchOrderResponse> {
    this.logger.log(`GET /order/${id}, userEmail = ${user.userEmail}`);
    return this.orderService.fetchOrder(id, user);
  }

  @ApiOperation({ summary: "fetch all client's pending orders" })
  @ApiOkResponse({
    description: 'returns a list of pending orders',
    type: FetchOrdersResponse,
  })
  @AllowMinRole(UserRoles.CLIENT)
  @Get('pending')
  async fetchPendingOrders(
    @UserDecorator() user: User,
  ): Promise<FetchOrdersResponse> {
    this.logger.log(`GET /order/pending, userEmail = ${user.userEmail}`);
    return this.orderService.fetchOrders(user, true);
  }

  @ApiOperation({ summary: 'create a new order' })
  @ApiOkResponse({
    description: 'new order created',
    type: FetchOrderResponse,
  })
  @AllowMinRole(UserRoles.CLIENT)
  @Post('/')
  async createOrder(
    @UserDecorator() user: User,
    @Body() newOrder: CreateOrderDto,
  ): Promise<OrderCreatedResponse> {
    this.logger.log(`POST /order, userEmail = ${user.userEmail}`);
    return this.orderService.createOrder(user, newOrder);
  }

  @ApiOperation({ summary: 'delete (mark as cancelled) an order' })
  @ApiOkResponse({
    description: 'order cancelled',
    type: FetchOrderResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find an order with this id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when cancelling order',
    type: RequestErrorResponse,
  })
  @AllowMinRole(UserRoles.CLIENT)
  @Delete(':id')
  async cancelOrder(
    @Param('id') id: string,
    @UserDecorator() user: User,
  ): Promise<FetchOrderResponse> {
    this.logger.log(`DELETE /order/${id}, userEmail = ${user.userEmail}`);
    return this.orderService.cancelOrder(id, user);
  }

  @ApiOperation({
    summary: 'fetch all orders from a restaurant with a given id',
  })
  @ApiOkResponse({
    description: 'returns zero or more orders',
    type: FetchOrdersResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a restaurant with given id',
    type: RequestErrorResponse,
  })
  @ApiBadRequestResponse({
    description: 'incorrect id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when fetching data',
    type: RequestErrorResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `EMPLOYEE`',
    type: RequestErrorResponse,
  })
  @AllowMinRole(UserRoles.EMPLOYEE)
  @Get('restaurant/:id')
  async fetchOrdersByRestaurant(
    @Param('id', ParseUUIDPipe) id: number,
    @UserDecorator() user: User,
  ): Promise<FetchOrdersResponse> {
    this.logger.log(`GET /order/restaurant/${id}`);
    return this.orderService.fetchOrdersByRestaurant(id, user);
  }

  @ApiOperation({
    summary: 'fetch all pending orders for a restaurant with given id',
  })
  @ApiOkResponse({
    description: 'returns pending orders data',
    type: FetchOrdersResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a restaurant with given id',
    type: RequestErrorResponse,
  })
  @ApiBadRequestResponse({
    description: 'incorrect id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when fetching data',
    type: RequestErrorResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `EMPLOYEE`',
    type: RequestErrorResponse,
  })
  @AllowMinRole(UserRoles.EMPLOYEE)
  @Get('restaurant/:id/pending')
  async fetchPendingOrdersByRestaurant(
    @Param('id', ParseUUIDPipe) id: number,
    @UserDecorator() user: User,
  ): Promise<FetchOrdersResponse> {
    this.logger.log(`GET /order/restaurant/${id}/pending`);
    return this.orderService.fetchOrdersByRestaurant(id, user, true);
  }

  @ApiOperation({ summary: 'update status of an order' })
  @ApiOkResponse({
    description: 'order updated',
    type: FetchOrderResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a restaurant with given id',
    type: RequestErrorResponse,
  })
  @ApiBadRequestResponse({
    description: 'incorrect id OR tried to reverse order status',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when fetching data',
    type: RequestErrorResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `EMPLOYEE`',
    type: RequestErrorResponse,
  })
  @AllowMinRole(UserRoles.EMPLOYEE)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param() updateStatusDto: UpdateOrderStatusDto,
    @UserDecorator() user: User,
  ): Promise<FetchOrderResponse> {
    this.logger.log(`PATCH /order/${updateStatusDto.id}`);
    return this.orderService.updateOrderStatus(updateStatusDto, user);
  }
}
