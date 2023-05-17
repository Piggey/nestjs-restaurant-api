import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AboutUserResponse } from './responses/about-user.response';
import { ClientPrincipalDto } from '../auth/dto';
import { PostgresService } from '../db/postgres/postgres.service';
import { User } from './entities/user.entity';
import { Employee } from '../employee/entities/employee.entity';

@Injectable()
export class UserService {
  constructor(private readonly db: PostgresService) {}

  async fetchUser(user: ClientPrincipalDto): Promise<AboutUserResponse> {
    const dbUser: User = await this.db.user.findFirst({
      where: { userId: user.userId },
    });

    if (!dbUser) {
      const err = new HttpException(
        `user with id = ${user.userId} not found in the database`,
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
