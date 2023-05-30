import { OrderStatus } from '../../../node_modules/@prisma-mongo/prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { AddressTypeDto } from '../../address-type/dto/address-type.dto';
import { MenuItemTypeDto } from '../../menu-item-type/dto/menu-item-type.dto';

export class Order {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  updatedAt: Date;
  @ApiProperty({
    enum: OrderStatus,
    required: false,
  })
  status: OrderStatus;
  @ApiProperty({
    required: false,
  })
  userEmail: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  address: AddressTypeDto | null;
  @ApiProperty({
    required: false,
  })
  restaurantId: string;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  orderedItems: MenuItemTypeDto[];
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  totalPrice: number;
  @ApiProperty({
    required: false,
  })
  currency: string;
}
