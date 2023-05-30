import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AllowMinRole, UserDecorator } from '../auth/decorator';
import { JWT_ACCESS_TOKEN_HEADER } from '../auth/dto';
import { FetchEmployeesResponse } from './responses/fetch-employees.response';
import { RolesGuard } from '../auth/guard';
import { UserRoles } from '../auth/model';
import { RequestErrorResponse } from '../app/response';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeCreatedResponse } from './responses/employee-created.response';
import { EmployeeUpdatedResponse } from './responses/employee-updated.response';
import { EmployeeDeletedResponse } from './responses/employee-deleted.response';
import { User } from '../user/entities/user.entity';

@ApiTags('employee')
@ApiBearerAuth()
@ApiHeader(JWT_ACCESS_TOKEN_HEADER)
@ApiForbiddenResponse({
  description: 'insufficient `UserRoles` privileges. minimum = `MANAGER`',
  type: RequestErrorResponse,
})
@UseGuards(RolesGuard)
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
  @AllowMinRole(UserRoles.MANAGER)
  @Get('/')
  async fetchEmployees(
    @UserDecorator() user: User,
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
  @AllowMinRole(UserRoles.MANAGER)
  @Post('/')
  async createEmployee(
    @Body() newEmployee: CreateEmployeeDto,
  ): Promise<EmployeeCreatedResponse> {
    this.logger.log(`POST /employee`);
    return this.employeeService.createEmployee(newEmployee);
  }

  @ApiOperation({ summary: 'update information about employee' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'employee updated successfully',
    type: EmployeeUpdatedResponse,
  })
  @ApiBadRequestResponse({
    description: 'new employee data was incorrect. email might be in used',
    type: RequestErrorResponse,
  })
  @AllowMinRole(UserRoles.MANAGER)
  @Patch(':id')
  async updateEmployee(
    @Param('id', ParseUUIDPipe) id: string,
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
  @AllowMinRole(UserRoles.MANAGER)
  @Delete(':id')
  async deleteEmployee(
    @Param('id', ParseIntPipe) id,
  ): Promise<EmployeeDeletedResponse> {
    this.logger.log(`DELETE /employee/${id}`);
    return this.employeeService.deleteEmployee(id);
  }
}
