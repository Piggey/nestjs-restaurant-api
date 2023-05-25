import { ApiProperty } from '@nestjs/swagger';
import { FranchiseApplication } from '../entities/franchise-application.entity';

export class FetchFranchiseApplicationResponse {
  @ApiProperty()
  franchiseApplication: FranchiseApplication;
}
