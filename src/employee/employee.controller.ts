import { Controller, Get, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AllowRoles, ClientPrincipal } from '../auth/decorator';
import {
  ClientPrincipalDto,
  SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO,
} from '../auth/dto';
import { FetchEmployeesResponse } from './responses/fetch-employees.response';
import { RolesGuard } from '../auth/guard';
import { UserRoles } from '../auth/model';
import { RequestErrorResponse } from '../app/response';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiHeader(SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO)
  @ApiOkResponse({
    description:
      'returns all hired employees in his restaurant for a `MANAGER` level role, returns all hired employees for `BOSS` level role',
    type: FetchEmployeesResponse,
  })
  @ApiBadRequestResponse({
    description: 'something went wrong with provided user data',
    type: RequestErrorResponse,
  })
  @ApiForbiddenResponse({
    description: '`userRole` level is not high enough',
    type: RequestErrorResponse,
  })
  @UseGuards(RolesGuard)
  @AllowRoles(UserRoles.MANAGER)
  @Get('/')
  async fetchEmployees(
    @ClientPrincipal() user: ClientPrincipalDto,
  ): Promise<FetchEmployeesResponse> {
    return this.employeeService.fetchEmployees(user);
  }
}
