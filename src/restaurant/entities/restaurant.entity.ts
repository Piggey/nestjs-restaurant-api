import { ApiProperty } from '@nestjs/swagger';
import { Manager } from '../../manager/entities/manager.entity';
import { Address } from '../../address/entities/address.entity';
import { OpeningHours } from '../../opening-hours/entities/opening-hours.entity';
import { Employee } from '../../employee/entities/employee.entity';

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
    required: false,
  })
  available: boolean;
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
  geoLon: number;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  manager?: Manager | null;
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
  openingHours?: OpeningHours[];
  @ApiProperty({
    isArray: true,
    required: false,
  })
  hiredEmployees?: Employee[];
}
