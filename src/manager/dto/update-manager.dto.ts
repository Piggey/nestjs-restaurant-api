import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreateEmployeeDto } from '../../employee/dto/create-employee.dto';
import { ConnectEmployeeDto } from '../../employee/dto/connect-employee.dto';
import { ConnectRestaurantDto } from '../../restaurant/dto/connect-restaurant.dto';

export class UpdateManagerEmployeeRelationInputDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: CreateEmployeeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEmployeeDto)
  create?: CreateEmployeeDto;
  @ApiProperty({
    required: false,
    nullable: true,
    type: ConnectEmployeeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectEmployeeDto)
  connect?: ConnectEmployeeDto;
}
export class UpdateManagerManagedRestaurantsRelationInputDto {
  @ApiProperty({
    isArray: true,
    type: ConnectRestaurantDto,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConnectRestaurantDto)
  connect: ConnectRestaurantDto[];
}

@ApiExtraModels(
  CreateEmployeeDto,
  ConnectEmployeeDto,
  UpdateManagerEmployeeRelationInputDto,
  ConnectRestaurantDto,
  UpdateManagerManagedRestaurantsRelationInputDto,
)
export class UpdateManagerDto {
  @ApiProperty({
    required: false,
    type: UpdateManagerEmployeeRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateManagerEmployeeRelationInputDto)
  employee?: UpdateManagerEmployeeRelationInputDto;
  @ApiProperty({
    required: false,
    type: UpdateManagerManagedRestaurantsRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateManagerManagedRestaurantsRelationInputDto)
  managedRestaurants?: UpdateManagerManagedRestaurantsRelationInputDto;
}
