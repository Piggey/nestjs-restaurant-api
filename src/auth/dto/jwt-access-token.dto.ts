import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export const JWT_ACCESS_TOKEN_HEADER = {
  name: 'authorization',
  description: 'JSON Web Token of a user: `Bearer {token}`',
  required: true,
};

export class JwtAccessTokenDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
