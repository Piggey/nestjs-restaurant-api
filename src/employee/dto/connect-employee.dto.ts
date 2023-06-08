import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  employeeId: string;
}
