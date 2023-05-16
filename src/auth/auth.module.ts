import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PostgresModule } from '../postgres/postgres.module';
import { RolesGuard } from './guard';

@Module({
  imports: [PostgresModule],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard],
})
export class AuthModule {}
