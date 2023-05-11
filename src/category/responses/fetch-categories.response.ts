import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

export class FetchCategoriesResponse {
  @ApiProperty()
  numCategories: number;

  @ApiProperty({ type: [Category] })
  categories: Category[];
}
