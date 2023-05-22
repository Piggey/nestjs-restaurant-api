import { OrderStatus } from '../../../node_modules/@prisma-mongo/prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ClientTypeDto } from '../../client-type/dto/client-type.dto';
import { AddressTypeDto } from '../../address-type/dto/address-type.dto';
import { MenuItemTypeDto } from '../../menu-item-type/dto/menu-item-type.dto';

export class OrderDto {
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
    enum: OrderStatus,
    required: false,
  })
  status: OrderStatus;
  @ApiProperty({
    required: false,
  })
  client: ClientTypeDto;
  @ApiProperty({
    required: false,
  })
  address: AddressTypeDto;
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
