import { ApiProperty } from '@nestjs/swagger';

export class ManagerDto {
  @ApiProperty({
    required: false,
  })
  managerId: string;
}
