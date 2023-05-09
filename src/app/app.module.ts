import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PostgresModule } from '../postgres/postgres.module';
import { UserModule } from '../user/user.module';
import { EmployeeModule } from '../employee/employee.module';
import { ManagerModule } from '../manager/manager.module';
import { MongoModule } from '../mongo/mongo.module';
import { MenuModule } from '../menu/menu.module';
import { RestaurantModule } from '../restaurant/restaurant.module';

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
  ],
})
export class AppModule {}
