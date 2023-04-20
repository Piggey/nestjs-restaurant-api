import { IsOptional, IsString, ValidateNested } from 'class-validator';
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
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    description: 'a list of ingredients separated by `,`',
    required: false,
  })
  @IsOptional()
  @IsString()
  ingredients?: string;
  @ApiProperty({
    required: false,
    type: UpdateMenuCategoryRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateMenuCategoryRelationInputDto)
  category?: UpdateMenuCategoryRelationInputDto;
}
