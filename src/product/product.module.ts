import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product';
import { SharedModule } from '../shared/shared.module';
import { ProductListener } from './eventListener/product.listener';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductListener],
})
export class ProductModule {}
