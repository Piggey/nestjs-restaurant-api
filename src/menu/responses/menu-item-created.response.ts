import { ApiProperty } from '@nestjs/swagger';
import { Menu } from '../entities/menu.entity';

export class MenuItemCreatedResponse {
  @ApiProperty()
  menuItem: Menu;
}
