import { ApiProperty } from '@nestjs/swagger';

export class AddressTypeDto {
  @ApiProperty({
    required: false,
  })
  street: string;
  @ApiProperty({
    required: false,
  })
  houseNumber: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  apartment: string | null;
  @ApiProperty({
    required: false,
  })
  city: string;
  @ApiProperty({
    required: false,
  })
  country: string;
}
