import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FetchEmployeesResponse } from './responses/fetch-employees.response';
import { PostgresService } from '../postgres/postgres.service';
import { UserRoles } from '../auth/model';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeCreatedResponse } from './responses/employee-created.response';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeUpdatedResponse } from './responses/employee-updated.response';
import { EmployeeDeletedResponse } from './responses/employee-deleted.response';
import { User } from '../user/entities/user.entity';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(private readonly db: PostgresService) {}

  async fetchEmployees(user: User): Promise<FetchEmployeesResponse> {
    if (user.userRole == UserRoles.BOSS) {
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

    if (user.userRole == UserRoles.MANAGER) {
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
    let employee: Employee;
    try {
      employee = await this.db.employee.create({
        include: { address: true, user: true, restaurant: true },
        data: newEmployee,
      });

      await this.db.user.update({
        where: { userId: employee.user.userId },
        data: { userRole: UserRoles.EMPLOYEE },
      });
    } catch (error) {
      let err;
      if (error.code === 'P2002') {
        err = new BadRequestException(
          'unique constraint violation when trying to create a new employee',
        );
      } else if (error.code === 'P2025') {
        err = new NotFoundException(error.meta.cause);
      } else {
        err = new BadRequestException('could not create a new employee');
      }

      Logger.error(err);
      throw err;
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
    let firedEmployee: Employee;
    try {
      firedEmployee = await this.db.employee.update({
        include: { user: true },
        where: { employeeId: id },
        data: { firedAt: new Date() },
      });

      // demote UserRole to CLIENT
      await this.db.user.update({
        where: { userId: firedEmployee.userId },
        data: { userRole: UserRoles.CLIENT },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        const err = new NotFoundException(`employee with id ${id} not found`);
        Logger.error(err);
        throw err;
      }

      throw new BadRequestException(
        'something went wrong when deleting employee',
      );
    }

    return {
      employeeDeleted: true,
      employeeData: firedEmployee,
    };
  }
}
