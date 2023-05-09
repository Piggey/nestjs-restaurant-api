import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PostgresModule } from '../postgres/postgres.module';
import { UserModule } from '../user/user.module';
import { EmployeeModule } from '../employee/employee.module';
import { ManagerModule } from '../manager/manager.module';

@Module({
  imports: [
    AuthModule,
    PostgresModule,
    MongoModule,
    UserModule,
    EmployeeModule,
    ManagerModule,
    MenuModule,
  ],
})
export class AppModule {}
