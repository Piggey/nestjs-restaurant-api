import { Injectable } from '@nestjs/common';
import { PostgresService } from '../db/postgres/postgres.service';
import { UserSignInResponse } from './responses';
import { User } from '../user/entities/user.entity';
import { JwtAccessTokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly db: PostgresService) {}

  async signIn(payload: JwtAccessTokenDto): Promise<UserSignInResponse> {
    const dbUser: User = await this.db.user.findFirst({
      where: {
        userEmail: payload.email,
      },
    });

    if (!dbUser) {
      const createdUser = await this.db.user.create({
        data: { userEmail: payload.email },
      });

      return {
        userSignedIn: true,
        userCreated: true,
        userData: createdUser,
      };
    }

    return {
      userSignedIn: true,
      userCreated: false,
      userData: dbUser,
    };
  }
}
