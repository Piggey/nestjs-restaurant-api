import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

export class CategoryDeletedResponse {
  @ApiProperty()
  category: Category;

  @ApiProperty()
  menuItemsDeleted: number;
}
