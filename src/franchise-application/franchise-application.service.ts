import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MongoService } from '../db/mongo/mongo.service';
import {
  FetchFranchiseApplicationResponse,
  FetchFranchiseApplicationsResponse,
} from './responses';
import { CreateFranchiseApplicationDto } from './dto/create-franchise-application.dto';

@Injectable()
export class FranchiseApplicationService {
  constructor(private readonly mongo: MongoService) {}

  async fetchFranchiseApplications(): Promise<FetchFranchiseApplicationsResponse> {
    const franchiseApplications =
      await this.mongo.franchiseApplication.findMany({
        where: { respondedTo: false },
      });

    return { franchiseApplications };
  }

  async respondToFranchiseApplication(
    id: string,
  ): Promise<FetchFranchiseApplicationResponse> {
    try {
      const franchiseApplication = await this.mongo.franchiseApplication.update(
        {
          where: { id },
          data: { respondedTo: true },
        },
      );
      return { franchiseApplication };
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new NotFoundException(
          `could not find franchise application ${id}`,
        );
      } else {
        err = new HttpException(error.message, HttpStatus.FAILED_DEPENDENCY);
      }

      Logger.error(err);
      throw err;
    }
  }

  async createFranchiseApplication(
    newFranchiseApplication: CreateFranchiseApplicationDto,
  ): Promise<FetchFranchiseApplicationResponse> {
    const franchiseApplication = await this.mongo.franchiseApplication.create({
      data: newFranchiseApplication,
    });

    return { franchiseApplication };
  }
}
