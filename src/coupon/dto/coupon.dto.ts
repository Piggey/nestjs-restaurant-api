import { ApiProperty } from '@nestjs/swagger';

export class CouponDto {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  name: string;
  @ApiProperty({
    required: false,
  })
  code: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  categoryId: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  categoryName: string | null;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  discount: number;
  @ApiProperty({
    required: false,
  })
  available: boolean;
}
