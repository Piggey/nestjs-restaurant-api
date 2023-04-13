import { ApiProperty } from '@nestjs/swagger';
import { IsByteLength, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum ClientRoles {
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE',
  DELIVERY = 'DELIVERY',
  MANAGER = 'MANAGER',
  BOSS = 'BOSS',

  // swa roles
  ANONYMOUS = 'anonymous',
  AUTHENTICATED = 'authenticated',
}

export const ClientRoleLevel: Record<ClientRoles, number> = {
  anonymous: 0,
  authenticated: 1,
  CLIENT: 2,
  EMPLOYEE: 3,
  DELIVERY: 4,
  MANAGER: 5,
  BOSS: 6,
};

export class ClientPrincipalDto {
  @ApiProperty()
  @IsByteLength(32, 32)
  userId: string;

  @ApiProperty({
    description:
      'list of known user roles. `anonymous` and `authenticated` will be ignored. only one value apart from those is allowed',
    enum: ClientRoles,
    example: [
      ClientRoles.ANONYMOUS,
      ClientRoles.AUTHENTICATED,
      ClientRoles.CLIENT,
    ],
    type: [String],
  })
  @IsString({ each: true })
  @IsEnum(ClientRoles, { each: true })
  @IsNotEmpty()
  userRoles: ClientRoles[];

  @ApiProperty()
  @IsString()
  userDetails: string;
}
