import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../entities/employee.entity';

export class EmployeeCreatedResponse {
  @ApiProperty()
  employeeCreated: boolean;

  @ApiProperty()
  employeeData: Employee;
}
