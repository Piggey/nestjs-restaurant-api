import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';
import { User } from '../../user/entities/user.entity';

export class OrderCreatedResponse {
  @ApiProperty()
  order: Order;

  @ApiProperty()
  user: User;

  @ApiProperty()
  loyaltyPointsGained: number;
}
