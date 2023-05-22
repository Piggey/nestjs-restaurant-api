import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiHeader,
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
import { FetchOrderResponse, FetchOrdersResponse } from './responses';
import { RequestErrorResponse } from '../app/response';
import { JWT_ACCESS_TOKEN_HEADER } from '../auth/dto';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('order')
@ApiHeader(JWT_ACCESS_TOKEN_HEADER)
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
  ): Promise<FetchOrderResponse> {
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
  @AllowMinRole(UserRoles.EMPLOYEE)
  @Get('restaurant/:id')
  async fetchOrdersByRestaurant(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FetchOrdersResponse> {
    this.logger.log(`GET /order/restaurant/${id}`);
    return this.orderService.fetchOrdersByRestaurant(id);
  }
}
