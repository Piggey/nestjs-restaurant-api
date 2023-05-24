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
import { JobApplicationService } from './job-application.service';
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
import {
  FetchJobApplicationResponse,
  FetchJobApplicationsResponse,
} from './responses';
import { RolesGuard } from '../auth/guard';
import { AllowMinRole } from '../auth/decorator';
import { UserRoles } from '../auth/model';
import { RequestErrorResponse } from '../app/response';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';

@ApiTags('application/job')
@Controller('application/job')
export class JobApplicationController {
  private readonly logger = new Logger(JobApplicationController.name);
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @ApiOperation({ summary: 'fetch all pending job applications' })
  @ApiOkResponse({
    description: 'returns all job applications that werent responded to yet',
    type: FetchJobApplicationsResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `BOSS`',
    type: RequestErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Get('')
  async fetchJobApplications(): Promise<FetchJobApplicationsResponse> {
    this.logger.log('GET /application/job');
    return this.jobApplicationService.fetchJobApplications();
  }

  @ApiOperation({ summary: 'mark a job application as responded to' })
  @ApiOkResponse({
    description: 'marks a job application as responded to',
    type: FetchJobApplicationResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a job application with given id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when updating job application',
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
  ): Promise<FetchJobApplicationResponse> {
    this.logger.log(`PATCH /application/job/${id}`);
    return this.jobApplicationService.respondToJobApplication(id);
  }

  @ApiOperation({ summary: 'create a new job application' })
  @ApiOkResponse({
    description: 'job application created',
    type: FetchJobApplicationResponse,
  })
  @ApiBadRequestResponse({
    description: 'job application data incorrect',
    type: RequestErrorResponse,
  })
  @Post('')
  async createJobApplication(
    @Body() newJobApplication: CreateJobApplicationDto,
  ): Promise<FetchJobApplicationResponse> {
    this.logger.log('POST /application/job');
    return this.jobApplicationService.createJobApplication(newJobApplication);
  }
}
