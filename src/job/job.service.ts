import { Injectable } from '@nestjs/common';
import { PostgresService } from '../db/postgres/postgres.service';
import { FetchJobsResponse } from './responses';

@Injectable()
export class JobService {
  constructor(private readonly db: PostgresService) {}

  async fetchJobs(): Promise<FetchJobsResponse> {
    const jobs = await this.db.job.findMany();
    return { jobs };
  }
}
