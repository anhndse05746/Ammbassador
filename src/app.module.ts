import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { ControllerService } from './controller/controller.service';
import { LinkModule } from './link/link.module';
import { SharedModule } from './shared/shared.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'ambassador',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
    LinkModule,
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [ControllerService],
})
export class AppModule {}
