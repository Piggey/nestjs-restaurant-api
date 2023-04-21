import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AllowMinRole, ClientPrincipal } from '../auth/decorator';
import {
  ClientPrincipalDto,
  SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO,
} from '../auth/dto';
import { FetchEmployeesResponse } from './responses/fetch-employees.response';
import { RolesGuard } from '../auth/guard';
import { UserRoles } from '../auth/model';
import { RequestErrorResponse } from '../app/response';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiOperation({ summary: 'return information about employees' })
  @ApiCookieAuth()
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
  @AllowMinRole(UserRoles.MANAGER)
  @Get('/')
  async fetchEmployees(
    @ClientPrincipal() user: ClientPrincipalDto,
  ): Promise<FetchEmployeesResponse> {
    Logger.log(`GET /employee, userId = ${user.userId}`);
    return this.employeeService.fetchEmployees(user);
  }

  @ApiOperation({ summary: 'add a new employee to our database' })
  @ApiCookieAuth()
  @ApiHeader(SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.MANAGER)
  @Post('/')
  async createEmployee(
    @ClientPrincipal() user: ClientPrincipalDto,
    @Body() newEmployee: CreateEmployeeDto,
  ) {
    Logger.log(`POST /employee, userId = ${user.userId}`);
    return this.employeeService.createEmployee(newEmployee);
  }

  @ApiOperation({ summary: 'update information about employee' })
  @ApiHeader(SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO)
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'employee updated successfully',
    type: EmployeeUpdatedResponse,
  })
  @ApiBadRequestResponse({
    description: 'new employee data was incorrect. email might be in used',
    type: RequestErrorResponse,
  })
  @ApiForbiddenResponse({
    description:
      '`UserRole` is not high enough to access this endpoint. min role is `MANAGER`',
    type: RequestErrorResponse,
  })
  @Patch(':id')
  async updateEmployee(
    @Param('id', ParseIntPipe) id,
    @Body() updatedEmployee: UpdateEmployeeDto,
  ): Promise<EmployeeUpdatedResponse> {
    return this.employeeService.updateEmployee(id, updatedEmployee);
  }
}
