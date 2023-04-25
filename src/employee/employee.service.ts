import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ClientPrincipalDto } from 'src/auth/dto';
import { FetchEmployeesResponse } from './responses/fetch-employees.response';
import { PrismaService } from '../prisma/prisma.service';
import { UserRoles } from '../auth/model';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeCreatedResponse } from './responses/employee-created.response';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeUpdatedResponse } from './responses/employee-updated.response';
import { EmployeeDeletedResponse } from './responses/employee-deleted.response';

@Injectable()
export class EmployeeService {
  constructor(private readonly db: PrismaService) {}

  async fetchEmployees(
    user: ClientPrincipalDto,
  ): Promise<FetchEmployeesResponse> {
    if (user.userRoles.includes(UserRoles.BOSS)) {
      const employees = await this.db.employee.findMany({
        include: {
          restaurant: { include: { address: true, manager: true } },
          address: true,
        },
        where: {
          firedAt: null,
        },
      });

      return { employees };
    }

    if (user.userRoles.includes(UserRoles.MANAGER)) {
      const employees = await this.db.employee.findMany({
        include: {
          address: true,
          restaurant: {
            include: {
              manager: { include: { employee: { include: { user: true } } } },
            },
          },
        },
        where: {
          firedAt: null,
          restaurant: { manager: { employee: { userId: user.userId } } },
        },
      });

      return { employees };
    }
  }

  async createEmployee(
    newEmployee: CreateEmployeeDto,
  ): Promise<EmployeeCreatedResponse> {
    let employee;
    try {
      employee = await this.db.employee.create({
        include: { address: true, user: true, restaurant: true },
        data: newEmployee,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        const err = new HttpException(
          'unique constraint violation when trying to create a new employee',
          HttpStatus.BAD_REQUEST,
        );
        Logger.error(err);
        throw err;
      }
    }

    return {
      employeeCreated: true,
      employeeData: employee,
    };
  }

  async updateEmployee(
    id: number,
    updatedEmployee: UpdateEmployeeDto,
  ): Promise<EmployeeUpdatedResponse> {
    let updated;
    try {
      updated = await this.db.employee.update({
        where: { employeeId: id },
        data: updatedEmployee,
      });
    } catch (error) {
      const err = new HttpException(
        `could not update employee ${id}`,
        HttpStatus.BAD_REQUEST,
      );
      Logger.error(err);
      throw err;
    }

    return {
      employeeUpdated: true,
      employeeData: updated,
    };
  }

  async deleteEmployee(id: number): Promise<EmployeeDeletedResponse> {
    let firedEmployee;
    try {
      firedEmployee = await this.db.employee.update({
        where: { employeeId: id },
        data: { firedAt: new Date() },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        const err = new HttpException(
          `employee with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
        Logger.error(err);
        throw err;
      }
    }

    return {
      employeeDeleted: true,
      employeeData: firedEmployee,
    };
  }
}
