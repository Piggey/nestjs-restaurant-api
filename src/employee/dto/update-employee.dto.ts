import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreateRestaurantDto } from '../../restaurant/dto/create-restaurant.dto';
import { ConnectRestaurantDto } from '../../restaurant/dto/connect-restaurant.dto';

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

@ApiExtraModels(
  CreateRestaurantDto,
  ConnectRestaurantDto,
  UpdateEmployeeRestaurantRelationInputDto,
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
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;
  @ApiProperty({
    required: false,
    type: UpdateEmployeeRestaurantRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeRestaurantRelationInputDto)
  restaurant?: UpdateEmployeeRestaurantRelationInputDto;
}
