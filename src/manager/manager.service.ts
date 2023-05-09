import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FetchManagersResponse } from './responses/fetch-managers.response';
import { PostgresService } from '../postgres/postgres.service';
import { ManagerCreatedResponse } from './responses/manager-created.response';
import { CreateManagerDto } from './dto/create-manager.dto';
import { ManagerUpdatedResponse } from './responses/manager-updated.response';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagerDeletedResponse } from './responses/manager-deleted.response';

@Injectable()
export class ManagerService {
  constructor(private readonly db: PostgresService) {}

  async fetchManagers(): Promise<FetchManagersResponse> {
    const managers = await this.db.manager.findMany({
      include: {
        employee: true,
        managedRestaurants: true,
      },
      where: {
        employee: { firedAt: null },
        managedRestaurants: { some: {} },
      },
    });

    return { managers };
  }

  async createManager(
    newManager: CreateManagerDto,
  ): Promise<ManagerCreatedResponse> {
    let manager;

    try {
      manager = await this.db.manager.create({ data: newManager });
    } catch (error) {
      let err;
      if (error.code === 'P2002') {
        err = new HttpException(
          'unique constraint violation when trying to create a new employee',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        err = new HttpException(
          'could not create a new manager',
          HttpStatus.FAILED_DEPENDENCY,
        );
      }

      Logger.log(err);
      throw err;
    }

    return {
      managerCreated: true,
      managerData: manager,
    };
  }

  async updateManager(
    id: number,
    updatedManager: UpdateManagerDto,
  ): Promise<ManagerUpdatedResponse> {
    let updated;
    try {
      updated = await this.db.manager.update({
        where: { managerId: id },
        data: updatedManager,
      });
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new HttpException(
          `manager with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        err = new HttpException(
          `could not update manager with id = ${id}`,
          HttpStatus.FAILED_DEPENDENCY,
        );
      }
      Logger.error(err);
      throw err;
    }

    return {
      managerUpdated: true,
      managerData: updated,
    };
  }

  async deleteManager(
    managerId: number,
    restaurantId: number,
  ): Promise<ManagerDeletedResponse> {
    let deleted;
    try {
      deleted = await this.db.manager.update({
        where: { managerId },
        data: {
          managedRestaurants: { disconnect: { restaurantId } },
        },
      });
    } catch (error) {
      const err = new HttpException(
        `error when firing manager ${managerId} from restaurant ${restaurantId}`,
        HttpStatus.FAILED_DEPENDENCY,
      );
      Logger.error(err);
      throw err;
    }

    return {
      managerDeleted: true,
      managerData: deleted,
    };
  }
}
