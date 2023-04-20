import { ApiProperty } from '@nestjs/swagger';
import { IsByteLength, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoles } from '../model';

export class UserAuthDto {
  @ApiProperty()
  @IsByteLength(32, 32)
  userId: string;

  @ApiProperty({
    description:
      'list of known user roles. `anonymous` and `authenticated` will be ignored. only one value apart from those is allowed',
    enum: UserRoles,
    example: [UserRoles.ANONYMOUS, UserRoles.AUTHENTICATED, UserRoles.CLIENT],
    type: [String],
  })
  @IsString({ each: true })
  @IsEnum(UserRoles, { each: true })
  @IsNotEmpty()
  userRoles: UserRoles[];

  @ApiProperty()
  @IsString()
  userDetails: string;
}
