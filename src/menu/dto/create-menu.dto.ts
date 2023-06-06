import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { ConnectCategoryDto } from '../../category/dto/connect-category.dto';

export class CreateMenuCategoryRelationInputDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: CreateCategoryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCategoryDto)
  create?: CreateCategoryDto;
  @ApiProperty({
    required: false,
    nullable: true,
    type: ConnectCategoryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectCategoryDto)
  connect?: ConnectCategoryDto;
}

@ApiExtraModels(
  CreateCategoryDto,
  ConnectCategoryDto,
  CreateMenuCategoryRelationInputDto,
)
export class CreateMenuDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  photoUrl: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  price: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  numberOfRatings?: number;
  @ApiProperty({
    description: 'a list of ingredients separated by `,`',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  ingredients?: string;
  @ApiProperty({
    type: CreateMenuCategoryRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateMenuCategoryRelationInputDto)
  category: CreateMenuCategoryRelationInputDto;
}
