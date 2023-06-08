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
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  ingredients: string | null;
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
