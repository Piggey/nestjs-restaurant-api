import { Injectable } from '@nestjs/common';
import { FetchManagersResponse } from './responses/fetch-managers.response';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ManagerService {
  constructor(private readonly db: PrismaService) {}

  async fetchManagers(): Promise<FetchManagersResponse> {
    const managers = await this.db.employee.findMany({
      include: {
        restaurant: { include: { address: true } },
        address: true,
      },
      where: {
        firedAt: null,
        managedRestaurants: { some: {} },
      },
    });

    return { managers };
  }
}
