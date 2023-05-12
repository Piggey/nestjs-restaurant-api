import { OrderStatus } from '../../../node_modules/@prisma-mongo/prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ClientTypeDto } from '../../clientType/dto/clientType.dto';
import { AddressTypeDto } from '../../addressType/dto/addressType.dto';
import { MenuItemTypeDto } from '../../menuItemType/dto/menuItemType.dto';

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
