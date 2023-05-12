import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectJobApplicationDto {
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  id?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  email?: string;
}
