import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductService } from './product.service';

@Controller('')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Get('admin/products')
  async all() {
    return this.productService.find({});
  }

  @UseGuards(AuthGuard)
  @Post('admin/products')
  async create(@Body() body: ProductCreateDto) {
    return this.productService.save(body);
  }

  @UseGuards(AuthGuard)
  @Get('admin/product/:id')
  async get(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put('admin/product/:id')
  async update(@Param('id') id: number, @Body() body: ProductCreateDto) {
    await this.productService.update(id, body);

    return this.productService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Delete('admin/product/:id')
  async delete(@Param('id') id: number) {
    return this.productService.delete({ id: id });
  }
}
