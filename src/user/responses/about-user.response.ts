import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Employee } from '../../employee/entities/employee.entity';

export class AboutUserResponse {
  @ApiProperty()
  userData: User;

  @ApiProperty()
  employeeData?: Employee;
}
