import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { OrderStatus } from '@prisma-mongo/prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty()
  @IsMongoId()
  id: string;

  @ApiProperty({ type: OrderStatus })
  status: OrderStatus;
}
