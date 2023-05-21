import { ApiProperty } from '@nestjs/swagger';

export class ClientTypeDto {
  @ApiProperty({
    required: false,
  })
  userId: string;
}
