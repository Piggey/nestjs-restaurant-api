import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectJobDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  jobId: string;
}
