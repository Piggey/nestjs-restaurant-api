import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeCreatedResponse } from './responses/employee-created.response';
import { EmployeeUpdatedResponse } from './responses/employee-updated.response';
import { EmployeeDeletedResponse } from './responses/employee-deleted.response';

@ApiTags('employee')
@ApiCookieAuth()
@ApiHeader(SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO)
@ApiForbiddenResponse({
  description: 'insufficient `UserRoles` privileges. minimum = `MANAGER`',
  type: RequestErrorResponse,
})
@UseGuards(RolesGuard)
@AllowMinRole(UserRoles.MANAGER)
@Controller('employee')
export class EmployeeController {
  private readonly logger = new Logger(EmployeeController.name);
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiOperation({ summary: 'return information about employees' })
  @ApiOkResponse({
    description:
      'returns all hired employees in his restaurant for a `MANAGER` level role, returns all hired employees for `BOSS` level role',
    type: FetchEmployeesResponse,
  })
  @ApiBadRequestResponse({
    description: 'something went wrong with provided user data',
    type: RequestErrorResponse,
  })
  @Get('/')
  async fetchEmployees(
    @ClientPrincipal() user: ClientPrincipalDto,
  ): Promise<FetchEmployeesResponse> {
    this.logger.log(`GET /employee, userId = ${user.userId}`);
    return this.employeeService.fetchEmployees(user);
  }

  @ApiOperation({ summary: 'add a new employee to our database' })
  @ApiCreatedResponse({
    description: 'a new employee created',
    type: EmployeeCreatedResponse,
  })
  @ApiBadRequestResponse({
    description:
      'new employees data was incorrect. email might be already in use',
    type: RequestErrorResponse,
  })
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.MANAGER)
  @Post('/')
  async createEmployee(
    @ClientPrincipal() user: ClientPrincipalDto,
    @Body() newEmployee: CreateEmployeeDto,
  ): Promise<EmployeeCreatedResponse> {
    this.logger.log(`POST /employee, userId = ${user.userId}`);
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
  @Patch(':id')
  async updateEmployee(
    @Param('id', ParseIntPipe) id,
    @Body() updatedEmployee: UpdateEmployeeDto,
  ): Promise<EmployeeUpdatedResponse> {
    this.logger.log(`PATCH /employee/${id}`);
    return this.employeeService.updateEmployee(id, updatedEmployee);
  }

  @ApiOperation({ summary: 'delete (mark as fired) an employee' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'marked employee as fired',
    type: EmployeeDeletedResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find an employee with this id',
    type: RequestErrorResponse,
  })
  @Delete(':id')
  async deleteEmployee(
    @Param('id', ParseIntPipe) id,
  ): Promise<EmployeeDeletedResponse> {
    this.logger.log(`DELETE /employee/${id}`);
    return this.employeeService.deleteEmployee(id);
  }
}
