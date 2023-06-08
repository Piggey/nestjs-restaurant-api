import { ApiProperty } from '@nestjs/swagger';

export class MenuItemTypeDto {
  @ApiProperty({
    required: false,
  })
  itemId: string;
  @ApiProperty({
    required: false,
  })
  name: string;
  @ApiProperty({
    required: false,
  })
  photoUrl: string;
  @ApiProperty({
    required: false,
  })
  description: string;
  @ApiProperty({
    required: false,
  })
  ingredients: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  quantity: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  price: number;
}
