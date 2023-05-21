import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AllowMinRole, UserDecorator } from '../auth/decorator';
import { User } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/guard';
import { UserRoles } from '../auth/model';
import { FetchOrderResponse, FetchOrdersResponse } from './responses';
import { RequestErrorResponse } from '../app/response';
import { JWT_ACCESS_TOKEN_HEADER } from '../auth/dto';

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
  @Get(':id')
  async fetchOrder(
    @Param('id') id: string,
    @UserDecorator() user: User,
  ): Promise<FetchOrderResponse> {
    this.logger.log(`GET /order/${id}, userEmail = ${user.userEmail}`);
    return this.orderService.fetchOrder(id, user);
  }

  @AllowMinRole(UserRoles.CLIENT)
  @Get('pending')
  async fetchPendingOrders(
    @UserDecorator() user: User,
  ): Promise<FetchOrdersResponse> {
    this.logger.log(`GET /order/pending, userEmail = ${user.userEmail}`);
    return this.orderService.fetchOrders(user, true);
  }
}
