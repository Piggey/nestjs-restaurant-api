import { IsByteLength, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsByteLength(64, 64)
  passwordHash: string; // SHA-256 encrypted password
}
