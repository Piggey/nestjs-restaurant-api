import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({
    required: false,
  })
  addressId: string;
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
