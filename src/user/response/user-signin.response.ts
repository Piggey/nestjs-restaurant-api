import { ApiProperty } from '@nestjs/swagger';

export class UserSignInResponse {
  @ApiProperty()
  access_token: string;
}
