import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreateRestaurantDto } from '../../restaurant/dto/create-restaurant.dto';
import { ConnectRestaurantDto } from '../../restaurant/dto/connect-restaurant.dto';
import { CreateJobDto } from '../../job/dto/create-job.dto';
import { ConnectJobDto } from '../../job/dto/connect-job.dto';

export class UpdateEmployeeRestaurantRelationInputDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: CreateRestaurantDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRestaurantDto)
  create?: CreateRestaurantDto;
  @ApiProperty({
    required: false,
    nullable: true,
    type: ConnectRestaurantDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectRestaurantDto)
  connect?: ConnectRestaurantDto;
}
export class UpdateEmployeeJobRelationInputDto {
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
  CreateRestaurantDto,
  ConnectRestaurantDto,
  UpdateEmployeeRestaurantRelationInputDto,
  CreateJobDto,
  ConnectJobDto,
  UpdateEmployeeJobRelationInputDto,
)
export class UpdateEmployeeDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;
  @ApiProperty({
    required: false,
    type: UpdateEmployeeRestaurantRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeRestaurantRelationInputDto)
  restaurant?: UpdateEmployeeRestaurantRelationInputDto;
  @ApiProperty({
    required: false,
    type: UpdateEmployeeJobRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeJobRelationInputDto)
  job?: UpdateEmployeeJobRelationInputDto;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  salary?: number;
}
