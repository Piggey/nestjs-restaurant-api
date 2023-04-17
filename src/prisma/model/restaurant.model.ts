import { ApiProperty } from '@nestjs/swagger';
import { AddressModel, EmployeeModel } from '.';

export class RestaurantModel {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  manager: EmployeeModel;

  @ApiProperty()
  address: AddressModel;

  @ApiProperty({ example: -34.397 })
  geoLat: number;

  @ApiProperty({ example: 150.644 })
  geoLong: number;
}
