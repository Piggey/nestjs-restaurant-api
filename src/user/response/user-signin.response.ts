import { ApiProperty } from '@nestjs/swagger';

export class UserSignInResponse {
  @ApiProperty()
  userSignedIn: boolean;

  @ApiProperty()
  userCreated: boolean;

  @ApiProperty()
  userUpdated: boolean;
}
