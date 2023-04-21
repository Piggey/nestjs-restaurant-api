import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { ManagerService } from './manager.service';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO } from '../auth/dto';
import { RequestErrorResponse } from '../app/response';
import { AllowMinRole } from '../auth/decorator';
import { UserRoles } from '../auth/model';
import { FetchManagersResponse } from './responses/fetch-managers.response';
import { RolesGuard } from '../auth/guard';

@ApiTags('manager')
@ApiCookieAuth()
@ApiHeader(SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO)
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
}
