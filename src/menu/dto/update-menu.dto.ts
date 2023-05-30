import {
  IsInt,
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

export class UpdateMenuCategoryRelationInputDto {
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
  UpdateMenuCategoryRelationInputDto,
)
export class UpdateMenuDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  photoUrl?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string | null;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  price?: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  numberOfRatings?: number | null;
  @ApiProperty({
    description: 'a list of ingredients separated by `,`',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  ingredients?: string | null;
  @ApiProperty({
    required: false,
    type: UpdateMenuCategoryRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateMenuCategoryRelationInputDto)
  category?: UpdateMenuCategoryRelationInputDto;
}
