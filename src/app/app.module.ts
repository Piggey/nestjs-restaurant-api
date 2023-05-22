import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PostgresModule } from '../db/postgres/postgres.module';
import { UserModule } from '../user/user.module';
import { EmployeeModule } from '../employee/employee.module';
import { ManagerModule } from '../manager/manager.module';
import { MongoModule } from '../db/mongo/mongo.module';
import { MenuModule } from '../menu/menu.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    AuthModule,
    PostgresModule,
    MongoModule,
    UserModule,
    EmployeeModule,
    ManagerModule,
    MenuModule,
    RestaurantModule,
    CategoryModule,
  ],
})
export class AppModule {}
