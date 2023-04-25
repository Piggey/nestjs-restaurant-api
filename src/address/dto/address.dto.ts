import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  addressId: number;
  @ApiProperty({
    required: false,
  })
  street: string;
  @ApiProperty({
    required: false,
  })
  streetNo: string;
  @ApiProperty({
    required: false,
  })
  city: string;
  @ApiProperty({
    required: false,
  })
  postalCode: string;
  @ApiProperty({
    required: false,
  })
  country: string;
}
