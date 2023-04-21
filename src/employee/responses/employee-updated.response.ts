import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../entities/employee.entity';

export class EmployeeUpdatedResponse {
  @ApiProperty()
  employeeUpdated: boolean;

  @ApiProperty()
  employeeData: Employee;
}
