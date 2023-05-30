import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ConnectEmployeeDto } from '../../employee/dto/connect-employee.dto';

export class CreateManagerEmployeeRelationInputDto {
  @ApiProperty({
    type: ConnectEmployeeDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectEmployeeDto)
  connect: ConnectEmployeeDto;
}

@ApiExtraModels(ConnectEmployeeDto, CreateManagerEmployeeRelationInputDto)
export class CreateManagerDto {
  @ApiProperty({
    type: CreateManagerEmployeeRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateManagerEmployeeRelationInputDto)
  employee: CreateManagerEmployeeRelationInputDto;
}
