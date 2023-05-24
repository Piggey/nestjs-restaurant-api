import { ApiProperty } from '@nestjs/swagger';
import { Job } from '../entities/job.entity';

export class FetchJobsResponse {
  @ApiProperty({ type: [Job] })
  jobs: Job[];
}
