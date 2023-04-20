import { Controller, Get } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiTags } from '@nestjs/swagger';
import { ClientPrincipal } from 'src/auth/decorator';
import { ClientPrincipalDto } from 'src/auth/dto';
import { FetchEmployeesResponse } from './responses/fetch-employees.response';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('/')
  async fetchEmployees(
    @ClientPrincipal() user: ClientPrincipalDto,
  ): Promise<FetchEmployeesResponse> {
    return this.employeeService.fetchEmployees(user);
  }
}
