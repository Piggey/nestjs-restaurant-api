import { ApiProperty } from '@nestjs/swagger';
import { AddressModel, UserModel, RestaurantModel } from '.';

export class EmployeeModel {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  address: AddressModel;

  restaurant: RestaurantModel;

  @ApiProperty()
  hiredAt: Date;

  @ApiProperty({
    description: 'will be null when employee is still hired',
    nullable: true,
    example: null,
  })
  firedAt: Date | null;

  @ApiProperty()
  client: UserModel;
}
