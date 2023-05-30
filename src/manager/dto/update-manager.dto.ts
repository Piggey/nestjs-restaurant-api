import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreateEmployeeDto } from '../../employee/dto/create-employee.dto';
import { ConnectEmployeeDto } from '../../employee/dto/connect-employee.dto';

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

@ApiExtraModels(
  CreateEmployeeDto,
  ConnectEmployeeDto,
  UpdateManagerEmployeeRelationInputDto,
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
}
