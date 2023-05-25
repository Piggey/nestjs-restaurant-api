import { ApiProperty } from '@nestjs/swagger';
import { FranchiseApplication } from '../entities/franchise-application.entity';

export class FetchFranchiseApplicationsResponse {
  @ApiProperty({ type: [FranchiseApplication] })
  franchiseApplications: FranchiseApplication[];
}
