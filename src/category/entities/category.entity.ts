import { ApiProperty } from '@nestjs/swagger';
import { Menu } from '../../menu/entities/menu.entity';

export class Category {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  categoryId: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
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
