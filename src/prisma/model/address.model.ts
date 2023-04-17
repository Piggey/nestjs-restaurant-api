import { ApiProperty } from '@nestjs/swagger';

export class AddressModel {
  @ApiProperty()
  street: string;

  @ApiProperty()
  streetNo: string;

  @ApiProperty()
  city: string;

  @ApiProperty({ example: 'XX-XXX' })
  postalCode: string;

  @ApiProperty({ example: 'Poland' })
  country: string;

  @ApiProperty({ example: -34.397 })
  geoLat: number;

  @ApiProperty({ example: 150.644 })
  geoLong: number;
}
