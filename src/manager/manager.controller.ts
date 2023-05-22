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
import { ManagerService } from './manager.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWT_ACCESS_TOKEN_HEADER } from '../auth/dto';
import { RequestErrorResponse } from '../app/response';
import { AllowMinRole } from '../auth/decorator';
import { UserRoles } from '../auth/model';
import { FetchManagersResponse } from './responses/fetch-managers.response';
import { RolesGuard } from '../auth/guard';
import { ManagerCreatedResponse } from './responses/manager-created.response';
import { CreateManagerDto } from './dto/create-manager.dto';
import { ManagerUpdatedResponse } from './responses/manager-updated.response';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagerDeletedResponse } from './responses/manager-deleted.response';

@ApiTags('manager')
@ApiBearerAuth()
@ApiHeader(JWT_ACCESS_TOKEN_HEADER)
@ApiForbiddenResponse({
  description: 'insufficient `UserRoles` privileges. minimum = `BOSS`',
  type: RequestErrorResponse,
})
@Controller('manager')
@UseGuards(RolesGuard)
export class ManagerController {
  private readonly logger = new Logger(ManagerController.name);
  constructor(private readonly managerService: ManagerService) {}

  @ApiOperation({ summary: 'return information about managers' })
  @ApiOkResponse({
    description: 'returns all managers',
    type: FetchManagersResponse,
  })
  @AllowMinRole(UserRoles.BOSS)
  @Get('/')
  async fetchManagers(): Promise<FetchManagersResponse> {
    this.logger.log('GET /manager');
    return this.managerService.fetchManagers();
  }

  @ApiOperation({ summary: 'create a new manager' })
  @ApiCreatedResponse({
    description: 'new manager created',
    type: ManagerCreatedResponse,
  })
  @ApiBadRequestResponse({
    description: 'new manager data was incorrect',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: 424,
    description: 'something went wrong when creating a new manager',
    type: RequestErrorResponse,
  })
  @AllowMinRole(UserRoles.BOSS)
  @Post('/')
  async createManager(
    @Body() newManager: CreateManagerDto,
  ): Promise<ManagerCreatedResponse> {
    this.logger.log('POST /manager');
    return this.managerService.createManager(newManager);
  }

  @ApiOperation({ summary: 'update managers information' })
  @ApiOkResponse({
    description: 'successfully updated manager with provided id',
    type: ManagerUpdatedResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a manager with this id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: 424,
    description: 'something went wrong when updating data to the database',
    type: RequestErrorResponse,
  })
  @AllowMinRole(UserRoles.BOSS)
  @Patch(':id')
  async updateManager(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedManager: UpdateManagerDto,
  ): Promise<ManagerUpdatedResponse> {
    return this.managerService.updateManager(id, updatedManager);
  }

  @ApiOperation({ summary: 'fire a manager from managing a restaurant' })
  @AllowMinRole(UserRoles.BOSS)
  @Delete(':managerId/:restaurantId')
  async deleteManager(
    @Param('managerId', ParseIntPipe) managerId: number,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ): Promise<ManagerDeletedResponse> {
    return this.managerService.deleteManager(managerId, restaurantId);
  }
}
