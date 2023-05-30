import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../../employee/entities/employee.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

export class Address {
  @ApiProperty({
    required: false,
  })
  addressId: string;
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
  employees?: Employee[];
  @ApiProperty({
    isArray: true,
    required: false,
  })
  restaurants?: Restaurant[];
}
