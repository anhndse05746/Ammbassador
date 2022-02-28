import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { SharedModule } from '../shared/shared.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, SharedModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
