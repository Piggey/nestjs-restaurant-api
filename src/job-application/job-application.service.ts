import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MongoService } from '../db/mongo/mongo.service';
import {
  FetchJobApplicationResponse,
  FetchJobApplicationsResponse,
} from './responses';

@Injectable()
export class JobApplicationService {
  constructor(private readonly mongo: MongoService) {}

  async fetchJobApplications(): Promise<FetchJobApplicationsResponse> {
    const jobApplications = await this.mongo.jobApplication.findMany({
      where: { respondedTo: false },
    });

    return { jobApplications };
  }

  async respondToJobApplication(
    id: string,
  ): Promise<FetchJobApplicationResponse> {
    try {
      const jobApplication = await this.mongo.jobApplication.update({
        where: { id },
        data: { respondedTo: true },
      });
      return { jobApplication };
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new NotFoundException(`could not find job application ${id}`);
      } else {
        err = new HttpException(error.meta.cause, HttpStatus.FAILED_DEPENDENCY);
      }

      Logger.error(err);
      throw err;
    }
  }
}
