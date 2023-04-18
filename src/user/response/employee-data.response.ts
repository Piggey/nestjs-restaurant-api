import { ApiProperty } from '@nestjs/swagger';
import { AddressModel } from '../../prisma/model';

class RestaurantDataResponse {
  @ApiProperty({ example: 'firstname lastname' })
  managerName: string;

  @ApiProperty()
  address: AddressModel;
}

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

  @ApiProperty({
    description: 'wont be returned in some cases',
    required: false,
  })
  restaurant?: RestaurantDataResponse;
}
