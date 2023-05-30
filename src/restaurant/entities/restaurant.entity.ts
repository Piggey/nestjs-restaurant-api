import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../../employee/entities/employee.entity';
import { OpeningHours } from '../../opening-hours/entities/opening-hours.entity';
import { Address } from '../../address/entities/address.entity';
import { Manager } from '../../manager/entities/manager.entity';

export class Restaurant {
  @ApiProperty({
    required: false,
  })
  restaurantId: string;
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
  managerId: string | null;
  @ApiProperty({
    required: false,
  })
  addressId: string;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  hiredEmployees?: Employee[];
  @ApiProperty({
    isArray: true,
    required: false,
  })
  openingHours?: OpeningHours[];
  @ApiProperty({
    required: false,
  })
  address?: Address;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  manager?: Manager | null;
}
