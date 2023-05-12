import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity';
import { Menu } from '../entities/menu.entity';

export class FetchMenuByCategoryResponse {
  @ApiProperty()
  category: Category;

  @ApiProperty()
  itemsAvailable: number;

  @ApiProperty({ type: [Menu] })
  menuItems: Menu[];
}
