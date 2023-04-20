import { ApiProperty } from '@nestjs/swagger';
import { IsByteLength, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoles } from '../model';
import { CLIENT_PRINCIPAL_HEADER } from '../decorator';

export const USER_ID_MAX_LENGTH = 32;

export const SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO = {
  name: CLIENT_PRINCIPAL_HEADER,
  description: 'Client principal encoded as base64',
  example:
    'ewogICJpZGVudGl0eVByb3ZpZGVyIjogImdpdGh1YiIsCiAgInVzZXJJZCI6ICIwa2gyYmozdmJwN2FnOWUyZTJla2NpMGE1Y21nMTd3dyIsCiAgInVzZXJEZXRhaWxzIjogInRlc3RVc2VyNTU0NSIsCiAgInVzZXJSb2xlcyI6IFsiYW5vbnltb3VzIiwgImF1dGhlbnRpY2F0ZWQiLCAiQ0xJRU5UIl0KfQ==',
  required: true,
};

export class ClientPrincipalDto {
  @ApiProperty({ required: false })
  @IsString()
  identityProvider?: string;

  @ApiProperty()
  @IsByteLength(USER_ID_MAX_LENGTH, USER_ID_MAX_LENGTH)
  userId: string;

  @ApiProperty()
  @IsString()
  userDetails: string;

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
}
