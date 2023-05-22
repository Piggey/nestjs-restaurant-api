import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

export class CategoryUpdatedResponse {
  @ApiProperty()
  category: Category;
}
