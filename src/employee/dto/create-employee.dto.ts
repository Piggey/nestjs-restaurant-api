import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { ConnectAddressDto } from '../../address/dto/connect-address.dto';
import { ConnectUserDto } from '../../user/dto/connect-user.dto';
import { ConnectRestaurantDto } from '../../restaurant/dto/connect-restaurant.dto';

export class CreateEmployeeAddressRelationInputDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: CreateAddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  create?: CreateAddressDto;
  @ApiProperty({
    required: false,
    nullable: true,
    type: ConnectAddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectAddressDto)
  connect?: ConnectAddressDto;
}
export class CreateEmployeeUserRelationInputDto {
  @ApiProperty({
    type: ConnectUserDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectUserDto)
  connect: ConnectUserDto;
}
export class CreateEmployeeRestaurantRelationInputDto {
  @ApiProperty({
    type: ConnectRestaurantDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectRestaurantDto)
  connect: ConnectRestaurantDto;
}

@ApiExtraModels(
  CreateAddressDto,
  ConnectAddressDto,
  CreateEmployeeAddressRelationInputDto,
  ConnectUserDto,
  CreateEmployeeUserRelationInputDto,
  ConnectRestaurantDto,
  CreateEmployeeRestaurantRelationInputDto,
)
export class CreateEmployeeDto {
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  firedAt?: Date;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @ApiProperty({
    type: CreateEmployeeAddressRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEmployeeAddressRelationInputDto)
  address: CreateEmployeeAddressRelationInputDto;
  @ApiProperty({
    type: CreateEmployeeUserRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEmployeeUserRelationInputDto)
  user: CreateEmployeeUserRelationInputDto;
  @ApiProperty({
    type: CreateEmployeeRestaurantRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEmployeeRestaurantRelationInputDto)
  restaurant: CreateEmployeeRestaurantRelationInputDto;
}
