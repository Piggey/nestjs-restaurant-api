import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  employeeId: string;
}
