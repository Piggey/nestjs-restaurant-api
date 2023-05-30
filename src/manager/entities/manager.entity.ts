import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../../employee/entities/employee.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

export class Manager {
  @ApiProperty({
    required: false,
  })
  managerId: string;
  @ApiProperty({
    required: false,
  })
  employee?: Employee;
  @ApiProperty({
    required: false,
  })
  employeeId: string;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  managedRestaurants?: Restaurant[];
}
