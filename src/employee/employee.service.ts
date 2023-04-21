import { Injectable } from '@nestjs/common';
import { ClientPrincipalDto } from 'src/auth/dto';
import { FetchEmployeesResponse } from './responses/fetch-employees.response';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRoles } from '../auth/model';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeCreatedResponse } from './responses/employee-created.response';

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
          restaurant: { include: { manager: { include: { user: true } } } },
        },
        where: {
          firedAt: null,
          restaurant: { manager: { userId: user.userId } },
        },
      });

      return { employees };
    }
  }

  async createEmployee(
    newEmployee: CreateEmployeeDto,
  ): Promise<EmployeeCreatedResponse> {
    // get or create address
    const employee = await this.db.employee.create({
      data: newEmployee,
    });
    console.log(employee);

    return {
      employeeCreated: true,
      employee,
    };
  }
}