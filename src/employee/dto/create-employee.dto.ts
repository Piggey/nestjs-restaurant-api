import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { ConnectAddressDto } from '../../address/dto/connect-address.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { ConnectUserDto } from '../../user/dto/connect-user.dto';
import { ConnectRestaurantDto } from '../../restaurant/dto/connect-restaurant.dto';
import { CreateJobDto } from '../../job/dto/create-job.dto';
import { ConnectJobDto } from '../../job/dto/connect-job.dto';

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
    required: false,
    nullable: true,
    type: CreateUserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserDto)
  create?: CreateUserDto;
  @ApiProperty({
    required: false,
    nullable: true,
    type: ConnectUserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectUserDto)
  connect?: ConnectUserDto;
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
export class CreateEmployeeJobRelationInputDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: CreateJobDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateJobDto)
  create?: CreateJobDto;
  @ApiProperty({
    required: false,
    nullable: true,
    type: ConnectJobDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectJobDto)
  connect?: ConnectJobDto;
}

@ApiExtraModels(
  CreateAddressDto,
  ConnectAddressDto,
  CreateEmployeeAddressRelationInputDto,
  CreateUserDto,
  ConnectUserDto,
  CreateEmployeeUserRelationInputDto,
  ConnectRestaurantDto,
  CreateEmployeeRestaurantRelationInputDto,
  CreateJobDto,
  ConnectJobDto,
  CreateEmployeeJobRelationInputDto,
)
export class CreateEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;
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
  @ApiProperty({
    type: CreateEmployeeJobRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEmployeeJobRelationInputDto)
  job: CreateEmployeeJobRelationInputDto;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  salary: number;
}
