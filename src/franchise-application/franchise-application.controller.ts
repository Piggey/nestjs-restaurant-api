import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FranchiseApplicationService } from './franchise-application.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guard';
import { AllowMinRole } from '../auth/decorator';
import { UserRoles } from '../auth/model';
import {
  FetchFranchiseApplicationResponse,
  FetchFranchiseApplicationsResponse,
} from './responses';
import { RequestErrorResponse } from '../app/response';
import { CreateFranchiseApplicationDto } from './dto/create-franchise-application.dto';

@ApiTags('application/franchise')
@Controller('application/franchise')
export class FranchiseApplicationController {
  private readonly logger = new Logger(FranchiseApplicationController.name);
  constructor(private readonly franchiseService: FranchiseApplicationService) {}

  @ApiOperation({ summary: 'fetch all pending franchise applications' })
  @ApiOkResponse({
    description: 'returns all franchise applications',
    type: FetchFranchiseApplicationsResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `BOSS`',
    type: RequestErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Get()
  async fetchFranchiseApplications(): Promise<FetchFranchiseApplicationsResponse> {
    this.logger.log('GET /application/franchise');
    return this.franchiseService.fetchFranchiseApplications();
  }

  @ApiOperation({ summary: 'mark a franchise application as responded to' })
  @ApiOkResponse({
    description: 'marks a franchise application as responded to',
    type: FetchFranchiseApplicationResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a franchise application with given id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when updating franchise application',
    type: RequestErrorResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `BOSS`',
    type: RequestErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Patch(':id')
  async respondToJobApplication(
    @Param('id') id: string,
  ): Promise<FetchFranchiseApplicationResponse> {
    this.logger.log(`PATCH /application/franchise/${id}`);
    return this.franchiseService.respondToFranchiseApplication(id);
  }

  @ApiOperation({ summary: 'create a new franchise application' })
  @ApiOkResponse({
    description: 'franchise application created',
    type: FetchFranchiseApplicationResponse,
  })
  @ApiBadRequestResponse({
    description: 'franchise application data incorrect',
    type: RequestErrorResponse,
  })
  @Post()
  async createJobApplication(
    @Body() newFranchiseApplication: CreateFranchiseApplicationDto,
  ): Promise<FetchFranchiseApplicationResponse> {
    this.logger.log('POST /application/franchise');
    return this.franchiseService.createFranchiseApplication(
      newFranchiseApplication,
    );
  }
}
