import { ClientDataResponse } from './client-data.response';
import { ApiProperty } from '@nestjs/swagger';
import { AddressModel } from 'src/prisma/model';

export class EmployeeDataResponse {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  address: AddressModel;

  @ApiProperty()
  hiredAt: Date;

  @ApiProperty({
    description: 'will be null when employee is still hired',
    nullable: true,
    example: null,
  })
  firedAt: Date | null;

  @ApiProperty()
  client: ClientDataResponse;
}
