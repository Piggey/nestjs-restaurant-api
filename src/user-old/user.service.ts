import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateEmployeeDto, ClientPrincipalDto } from './dto';
import {
  AboutUserResponse,
  CreateEmployeeResponse,
  EmployeeDataResponse,
  FetchEmployeesResponse,
  FetchManagersResponse,
  ManagerDataResponse,
  UserDataResponse,
} from './response';
import { PrismaService } from '../prisma/prisma.service';
import { UserRoles } from '../auth/model';
import { Address, Employee } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async me(user: ClientPrincipalDto): Promise<AboutUserResponse> {
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

  async fetchEmployees(user: ClientPrincipalDto): Promise<FetchEmployeesResponse> {
    if (user.userRoles.includes(UserRoles.BOSS)) {
      const dbEmployees = await this.db.employee.findMany({
        include: {
          restaurant: { include: { address: true, manager: true } },
          address: true,
        },
        where: {
          firedAt: null,
        },
      });

      const employees: EmployeeDataResponse[] = dbEmployees.map((employee) => ({
        firstName: employee.firstName,
        lastName: employee.lastName,
        hiredAt: employee.hiredAt,
        firedAt: employee.firedAt,
        address: employee.address,
        restaurant: {
          managerName:
            `${employee.restaurant.manager.firstName} ${employee.restaurant.manager.lastName}` ||
            null,
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
            { firedAt: null },
            { restaurant: { manager: { userId: user.userId } } },
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

  async fetchManagers() {
    const dbManagers = await this.db.employee.findMany({
      include: { managedRestaurants: true, user: true },
      where: {
        user: { role: 'MANAGER' },
        firedAt: null,
      },
    });

    if (!dbManagers)
      throw new HttpException(
        'could not find any managers',
        HttpStatus.NOT_FOUND,
      );

    return { dbManagers };
  }

  async createEmployee(
    user: ClientPrincipalDto,
    employee: CreateEmployeeDto,
  ): Promise<CreateEmployeeResponse> {
    // try to find user
    const [dbUser, dbRestaurant] = await Promise.all([
      this.db.user.findFirst({ where: { userId: employee.userId } }),
      this.db.restaurant.findFirst({
        include: { manager: true, address: true },
        where: { restaurantId: employee.restaurantId },
      }),
    ]);

    if (!dbUser)
      throw new HttpException(
        `user with userId = ${employee.userId} was not found`,
        HttpStatus.NOT_FOUND,
      );

    if (!dbRestaurant)
      throw new HttpException(
        `restaurant with restaurantId = ${employee.restaurantId} was not found`,
        HttpStatus.NOT_FOUND,
      );

    let newAddress: Address;
    let newEmployee: Employee;
    try {
      newAddress = await this.db.address.create({
        data: {
          city: employee.city,
          country: employee.country,
          postalCode: employee.postalCode,
          street: employee.street,
          streetNo: employee.streetNo,
        },
      });

      newEmployee = await this.db.employee.create({
        data: {
          firstName: employee.firstName,
          lastName: employee.lastName,
          pesel: employee.pesel,
          user: { connect: { userId: dbUser.userId } },
          address: { connect: { addressId: newAddress.addressId } },
          restaurant: { connect: { restaurantId: dbRestaurant.restaurantId } },
        },
      });

      return {
        employeeCreated: true,
        employee: {
          firstName: newEmployee.firstName,
          lastName: newEmployee.lastName,
          hiredAt: newEmployee.hiredAt,
          firedAt: newEmployee.firedAt,
          address: {
            country: newAddress.country,
            postalCode: newAddress.postalCode,
            city: newAddress.city,
            street: newAddress.street,
            streetNo: newAddress.streetNo,
          },
          restaurant: {
            managerName:
              `${dbRestaurant.manager.firstName} ${dbRestaurant.manager.lastName}` ||
              null,
            address: dbRestaurant.address,
          },
        },
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'could not create new employee',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }
}
