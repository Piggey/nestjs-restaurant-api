import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../../employee/entities/employee.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

export class Manager {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  managerId: number;
  @ApiProperty({
    required: false,
  })
  employee?: Employee;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  employeeId: number;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  managedRestaurants?: Restaurant[];
}
