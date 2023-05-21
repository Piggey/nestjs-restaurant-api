import { ApiProperty } from '@nestjs/swagger';

export class AddressTypeDto {
  @ApiProperty({
    required: false,
  })
  street: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  houseNumber: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
    nullable: true,
  })
  apartment: number | null;
  @ApiProperty({
    required: false,
  })
  city: string;
  @ApiProperty({
    required: false,
  })
  country: string;
}
