import { ApiProperty } from '@nestjs/swagger';
import { JobApplication } from '../entities/job-application.entity';

export class FetchJobApplicationsResponse {
  @ApiProperty({ type: [JobApplication] })
  jobApplications: JobApplication[];
}
