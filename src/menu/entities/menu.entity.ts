import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity';

export class Menu {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  itemId: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  updatedAt: Date;
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
    description: 'a list of ingredients separated by `,`',
    required: false,
  })
  ingredients: string;
  @ApiProperty({
    required: false,
  })
  available: boolean;
  @ApiProperty({
    required: false,
  })
  category?: Category;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  categoryId: number;
}
