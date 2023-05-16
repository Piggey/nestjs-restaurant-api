import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AboutUserResponse } from './responses/about-user.response';
import { JwtAccessTokenDto } from '../auth/dto';
import { PostgresService } from '../postgres/postgres.service';
import { User } from './entities/user.entity';
import { Employee } from '../employee/entities/employee.entity';

@Injectable()
export class UserService {
  constructor(private readonly db: PostgresService) {}

  async aboutMe(payload: JwtAccessTokenDto): Promise<AboutUserResponse> {
    const dbUser: User = await this.db.user.findFirst({
      where: { userEmail: payload.email },
    });

    if (!dbUser) {
      const err = new HttpException(
        `user ${payload.email} not found in the database`,
        HttpStatus.NOT_FOUND,
      );
      Logger.error(err);
      throw err;
    }

    const dbEmployee: Employee = await this.db.employee.findFirst({
      include: { address: true, restaurant: true },
      where: { userId: dbUser.userId },
    });

    if (!dbEmployee) return { userData: dbUser };

    return {
      userData: dbUser,
      employeeData: dbEmployee,
    };
  }
}
