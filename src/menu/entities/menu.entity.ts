import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity';

export class Menu {
  @ApiProperty({
    required: false,
  })
  itemId: string;
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
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  price: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
    nullable: true,
  })
  rating: number | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
    nullable: true,
  })
  numberOfRatings: number | null;
  @ApiProperty({
    description: 'a list of ingredients separated by `,`',
    required: false,
    nullable: true,
  })
  ingredients: string | null;
  @ApiProperty({
    required: false,
  })
  available: boolean;
  @ApiProperty({
    required: false,
  })
  categoryId: string;
  @ApiProperty({
    required: false,
  })
  category?: Category;
}
