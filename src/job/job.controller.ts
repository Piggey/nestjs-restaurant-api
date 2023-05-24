import { Controller, Get, Logger } from '@nestjs/common';
import { JobService } from './job.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FetchJobsResponse } from './responses';

@ApiTags('job')
@Controller('job')
export class JobController {
  private readonly logger = new Logger(JobController.name);
  constructor(private readonly jobService: JobService) {}

  @ApiOperation({ summary: 'fetch all jobs' })
  @ApiOkResponse({
    description: 'returns all jobs',
    type: FetchJobsResponse,
  })
  @Get('/')
  async fetchJobs(): Promise<FetchJobsResponse> {
    this.logger.log('GET /job');
    return this.jobService.fetchJobs();
  }
}
