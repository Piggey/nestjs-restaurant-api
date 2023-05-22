import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';

export class FetchOrdersResponse {
  @ApiProperty({ type: [Order] })
  orders: Order[];
}
