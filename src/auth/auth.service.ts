import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { ClientPrincipalDto } from './dto';
import { UserSignInResponse } from './responses';

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService) {}

  async signIn(usr: ClientPrincipalDto): Promise<UserSignInResponse> {
    const dbUser: User = await this.db.user.findFirst({
      where: {
        userId: usr.userId,
      },
    });

    if (!dbUser) {
      await this.db.user.create({
        data: {
          userId: usr.userId,
          userDetails: usr.userDetails,
          role: usr.userRoles[0] as Role,
        },
      });

      return {
        userSignedIn: true,
        userCreated: true,
        userUpdated: true,
      };
    }

    if (
      dbUser.role !== (usr.userRoles[0] as Role) ||
      dbUser.userDetails !== usr.userDetails
    ) {
      await this.db.user.update({
        where: {
          userId: usr.userId,
        },
        data: {
          role: usr.userRoles[0] as Role,
          userDetails: usr.userDetails,
        },
      });

      return {
        userSignedIn: true,
        userCreated: false,
        userUpdated: true,
      };
    }

    return {
      userSignedIn: true,
      userCreated: false,
      userUpdated: false,
    };
  }
}
