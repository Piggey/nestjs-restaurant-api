import { ApiProperty } from '@nestjs/swagger';
import { Menu } from '../entities/menu.entity';

export class FetchMenuResponse {
  @ApiProperty()
  itemsAvailable: number;

  @ApiProperty({ type: [Menu] })
  menuItems: Menu[];
}
