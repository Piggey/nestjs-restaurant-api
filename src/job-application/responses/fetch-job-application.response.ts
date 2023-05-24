import { ApiProperty } from '@nestjs/swagger';
import { JobApplication } from '../entities/job-application.entity';

export class FetchJobApplicationResponse {
  @ApiProperty()
  jobApplication: JobApplication;
}
