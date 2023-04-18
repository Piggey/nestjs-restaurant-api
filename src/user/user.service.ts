import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserAuthDto } from './dto';
import {
  AboutUserResponse,
  EmployeeDataResponse,
  FetchEmployeesResponse,
  UserDataResponse,
} from './response';
import { PrismaService } from '../prisma/prisma.service';
import { UserRoles } from './model';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async me(user: UserAuthDto): Promise<AboutUserResponse> {
    const dbUser = await this.db.user.findFirst({
      where: { userId: user.userId },
    });

    if (!dbUser) {
      throw new HttpException(
        `user with id = ${user.userId} not found in the database`,
        HttpStatus.NOT_FOUND,
      );
    }

    const userData: UserDataResponse = {
      userDetails: dbUser.userDetails,
      userRole: dbUser.role,
      loyaltyPoints: dbUser.loyaltyPoints,
    };

    const employee = await this.db.employee.findFirst({
      where: { userId: dbUser.userId },
      include: {
        address: true,
        restaurant: {
          include: {
            address: true,
            manager: true,
          },
        },
      },
    });

    if (!employee) return { user: userData };

    const employeeAddress = employee.address;
    const restaurant = employee.restaurant;
    const restaurantAddress = restaurant.address;
    const restaurantManager = restaurant.manager;

    return {
      user: userData,
      employee: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        address: employeeAddress,
        hiredAt: employee.hiredAt,
        firedAt: employee.firedAt,
        restaurant: {
          managerName: `${restaurantManager.firstName} ${restaurantManager.lastName}`,
          address: restaurantAddress,
        },
      },
    };
  }

  async fetchEmployees(user: UserAuthDto): Promise<FetchEmployeesResponse> {
    if (user.userRoles.includes(UserRoles.BOSS)) {
      const dbEmployees = await this.db.employee.findMany({
        include: {
          restaurant: { include: { address: true, manager: true } },
          address: true,
        },
        where: {
          firedAt: { not: null },
        },
      });

      const employees: EmployeeDataResponse[] = dbEmployees.map((employee) => ({
        firstName: employee.firstName,
        lastName: employee.lastName,
        hiredAt: employee.hiredAt,
        firedAt: employee.firedAt,
        address: employee.address,
        restaurant: {
          managerName: `${employee.restaurant.manager.firstName} ${employee.restaurant.manager.lastName}`,
          address: employee.restaurant.address,
        },
      }));

      return { employees };
    }

    if (user.userRoles.includes(UserRoles.MANAGER)) {
      const dbEmployees = await this.db.employee.findMany({
        include: {
          restaurant: {
            include: { manager: { include: { user: true } } },
          },
          address: true,
        },
        where: {
          AND: [
            { firedAt: { not: null }},
            { restaurant: { manager: { userId: user.userId }}},
          ],
        },
      });

      const employees: EmployeeDataResponse[] = dbEmployees.map((employee) => ({
        firstName: employee.firstName,
        lastName: employee.lastName,
        hiredAt: employee.hiredAt,
        firedAt: employee.firedAt,
        address: employee.address,
      }));

      return { employees };
    }
  }
}
