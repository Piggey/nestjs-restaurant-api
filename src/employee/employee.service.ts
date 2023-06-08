import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FetchEmployeesResponse } from './responses/fetch-employees.response';
import { PostgresService } from '../db/postgres/postgres.service';
import { UserRoles } from '../auth/model';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeCreatedResponse } from './responses/employee-created.response';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeUpdatedResponse } from './responses/employee-updated.response';
import { EmployeeDeletedResponse } from './responses/employee-deleted.response';
import { User } from '../user/entities/user.entity';
import { Employee } from './entities/employee.entity';
import { CreateJobDto } from '../job/dto/create-job.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly db: PostgresService) {}

  async fetchEmployees(user: User): Promise<FetchEmployeesResponse> {
    if (user.userRole == UserRoles.BOSS) {
      const employees = await this.db.employee.findMany({
        include: {
          job: true,
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
          job: true,
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
    // make sure employee's salary is within its job range
    const job = await this.databaseFetchJob(newEmployee);
    if (
      newEmployee.salary < job.minSalary ||
      newEmployee.salary > job.maxSalary
    ) {
      throw new BadRequestException(
        "new employee's salary is not within job's range",
      );
    }

    let employee: Employee;
    try {
      employee = await this.db.employee.create({
        include: { address: true, user: true, restaurant: true, job: true },
        data: newEmployee,
      });

      // assign correct UserRole based on new employee data
      await this.db.user.update({
        where: { userId: employee.user.userId },
        data: { userRole: employee.job.role },
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
    id: string,
    updatedEmployee: UpdateEmployeeDto,
  ): Promise<EmployeeUpdatedResponse> {
    const employee = await this.db.employee.findFirst({
      include: { job: true },
      where: {
        employeeId: id,
        firedAt: null,
      },
    });
    if (!employee) {
      const error = new NotFoundException(`could not find employee ${id}`);
      Logger.error(error);
      throw error;
    }

    const job = employee.job;
    if (
      updatedEmployee.salary < job.minSalary ||
      updatedEmployee.salary > job.maxSalary
    ) {
      throw new BadRequestException(
        `new salary out of range [${job.minSalary}, ${job.maxSalary}]`,
      );
    }

    try {
      const updated = await this.db.employee.update({
        include: { job: true },
        where: { employeeId: id },
        data: updatedEmployee,
      });

      return { employeeUpdated: true, employeeData: updated };
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new NotFoundException(`could not find employee with id ${id}`);
      } else {
        err = new HttpException(error.meta.cause, HttpStatus.FAILED_DEPENDENCY);
      }

      Logger.error(err);
      throw err;
    }
  }

  async deleteEmployee(id: string): Promise<EmployeeDeletedResponse> {
    let firedEmployee: Employee;
    try {
      firedEmployee = await this.db.employee.update({
        include: { user: true, job: true },
        where: { employeeId: id },
        data: { firedAt: new Date() },
      });

      // demote UserRole to CLIENT
      await this.db.user.update({
        where: { userId: firedEmployee.userId },
        data: { userRole: UserRoles.CLIENT },
      });
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new NotFoundException(`employee with id ${id} not found`);
      } else {
        err = new HttpException(error.meta.cause, HttpStatus.FAILED_DEPENDENCY);
      }

      Logger.error(err);
      throw err;
    }

    return {
      employeeDeleted: true,
      employeeData: firedEmployee,
    };
  }

  private async databaseFetchJob(
    newEmployee: CreateEmployeeDto,
  ): Promise<CreateJobDto> {
    if (newEmployee.job.create) {
      return newEmployee.job.create;
    }

    const job = await this.db.job.findUnique({
      where: newEmployee.job.connect,
    });
    if (!job) {
      throw new NotFoundException('could not find job with this id');
    }

    return job;
  }
}
