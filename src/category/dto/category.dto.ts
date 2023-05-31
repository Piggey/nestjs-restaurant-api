import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
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
    required: false,
  })
  photoUrl: string;
}
