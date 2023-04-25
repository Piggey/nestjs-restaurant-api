import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class UserSignInResponse {
  @ApiProperty()
  userSignedIn: boolean;

  @ApiProperty()
  userCreated: boolean;

  @ApiProperty()
  userData: User;
}
