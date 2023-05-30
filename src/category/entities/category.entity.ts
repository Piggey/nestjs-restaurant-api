import { ApiProperty } from '@nestjs/swagger';
import { Menu } from '../../menu/entities/menu.entity';

export class Category {
  @ApiProperty({
    required: false,
  })
  categoryId: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  available: boolean;
  @ApiProperty({
    required: false,
  })
  categoryName: string;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  menuItems?: Menu[];
}
