import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientPrincipalDto } from './dto';
import { UserSignInResponse } from './responses';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService) {}

  async signIn(user: ClientPrincipalDto): Promise<UserSignInResponse> {
    const dbUser: User = await this.db.user.findFirst({
      where: {
        userId: user.userId,
      },
    });

    if (!dbUser) {
      const createdUser = await this.db.user.create({
        data: { userId: user.userId },
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
