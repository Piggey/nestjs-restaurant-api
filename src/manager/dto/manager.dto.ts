import { ApiProperty } from '@nestjs/swagger';

export class ManagerDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  managerId: number;
}
