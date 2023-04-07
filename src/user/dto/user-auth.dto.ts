import { ApiProperty } from '@nestjs/swagger';
import { IsByteLength, IsEmail, IsString } from 'class-validator';

export class UserAuthDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'f6fc84c9f21c24907d6bee6eec38cabab5fa9a7be8c4a7827fe9e56f245bd2d5',
    minLength: 64,
    maxLength: 64,
  })
  @IsString()
  @IsByteLength(64, 64)
  passwordHash: string; // SHA-256 encrypted password
}
