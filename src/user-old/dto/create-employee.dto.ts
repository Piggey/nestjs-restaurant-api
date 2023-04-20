import { ApiProperty } from '@nestjs/swagger';
import { IsByteLength, IsInt, IsPositive, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsByteLength(32, 32)
  userId: string;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  restaurantId: number;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsByteLength(11, 11)
  pesel: string;

  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  streetNo: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsString()
  country: string;
}
