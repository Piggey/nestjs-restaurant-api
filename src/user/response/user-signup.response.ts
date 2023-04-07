import { ApiProperty } from '@nestjs/swagger';

export class UserSignUpResponse {
  @ApiProperty()
  userCreated: boolean;
}
