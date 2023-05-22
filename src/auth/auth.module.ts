import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RolesGuard],
})
export class AuthModule {}
