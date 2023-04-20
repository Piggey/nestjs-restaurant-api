import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../../employee/entities/employee.entity';
import { Address } from '../../address/entities/address.entity';

export class Restaurant {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  restaurantId: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  geoLat: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  geoLong: number;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  manager?: Employee | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
    nullable: true,
  })
  managerId: number | null;
  @ApiProperty({
    required: false,
  })
  address?: Address;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  addressId: number;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  hiredEmployees?: Employee[];
}
