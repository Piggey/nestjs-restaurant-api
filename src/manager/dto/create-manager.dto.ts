import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ConnectEmployeeDto } from '../../employee/dto/connect-employee.dto';
import { ConnectRestaurantDto } from '../../restaurant/dto/connect-restaurant.dto';

export class CreateManagerEmployeeRelationInputDto {
  @ApiProperty({
    type: ConnectEmployeeDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectEmployeeDto)
  connect: ConnectEmployeeDto;
}
export class CreateManagerManagedRestaurantsRelationInputDto {
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
  ConnectEmployeeDto,
  CreateManagerEmployeeRelationInputDto,
  ConnectRestaurantDto,
  CreateManagerManagedRestaurantsRelationInputDto,
)
export class CreateManagerDto {
  @ApiProperty({
    type: CreateManagerEmployeeRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateManagerEmployeeRelationInputDto)
  employee: CreateManagerEmployeeRelationInputDto;
  @ApiProperty({
    type: CreateManagerManagedRestaurantsRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateManagerManagedRestaurantsRelationInputDto)
  managedRestaurants?: CreateManagerManagedRestaurantsRelationInputDto;
}
