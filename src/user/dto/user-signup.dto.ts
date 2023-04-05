import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  passwordHash: string;
}
