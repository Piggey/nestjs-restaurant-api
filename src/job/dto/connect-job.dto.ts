import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectJobDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  jobId: string;
}
