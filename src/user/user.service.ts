import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserAuthDto } from './dto';
import { AboutUserResponse, UserDataResponse } from './response';
import { PrismaService } from '../prisma/prisma.service';

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
    });

    if (!employee) return { user: userData };

    // query database asynchronously
    const [employeeAddress, restaurant] = await Promise.all([
      this.db.address.findFirst({ where: { addressId: employee.addressId } }),
      this.db.restaurant.findFirst({
        where: { restaurantId: employee.restaurantId },
      }),
    ]);

    const [restaurantAddress, restaurantManager] = await Promise.all([
      this.db.address.findFirst({ where: { addressId: restaurant.addressId } }),
      this.db.employee.findFirst({
        where: { employeeId: restaurant.managerId },
      }),
    ]);

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
}
