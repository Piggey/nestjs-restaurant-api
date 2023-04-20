import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Employee } from '../../employee/entities/employee.entity';

export class Address {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  addressId: number;
  @ApiProperty({
    required: false,
  })
  street: string;
  @ApiProperty({
    required: false,
  })
  streetNo: string;
  @ApiProperty({
    required: false,
  })
  city: string;
  @ApiProperty({
    required: false,
  })
  postalCode: string;
  @ApiProperty({
    required: false,
  })
  country: string;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  restaurants?: Restaurant[];
  @ApiProperty({
    isArray: true,
    required: false,
  })
  employees?: Employee[];
}
