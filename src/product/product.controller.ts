import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductService } from './product.service';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { Product } from './product';

@Controller('')
export class ProductController {
  constructor(
    private productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventEmitter: EventEmitter2,
  ) {}

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
    //update product
    await this.productService.update(id, body);

    //trigger product_updated event to delete cache
    this.eventEmitter.emit('product_updated');

    return this.productService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Delete('admin/product/:id')
  async delete(@Param('id') id: number) {
    //delete product
    const result = await this.productService.delete({ id: id });

    //trigger product_updated event to delete cache
    this.eventEmitter.emit('product_updated');

    return result;
  }

  @Get('ambassador/products/frontend')
  async frontend() {
    let products = await this.cacheManager.get('products_frontend');

    if (!products) {
      products = await this.productService.find({});
      await this.cacheManager.set('products_frontend', products, { ttl: 1800 });
    }

    return products;
  }

  @Get('ambassador/products/backend')
  async backend(@Req() request: Request) {
    let products = await this.cacheManager.get<Product[]>('products_frontend');

    if (!products) {
      products = await this.productService.find({});
      await this.cacheManager.set('products_frontend', products, { ttl: 1800 });
    }

    //Searching
    if (request.query.search) {
      let s = request.query.search as string;
      products = products.filter(
        (item) =>
          item.title.toLocaleLowerCase().indexOf(s.toLocaleLowerCase()) >= 0 ||
          item.title.toLocaleLowerCase().indexOf(s.toLocaleLowerCase()) >= 0,
      );
    }

    //Sorting
    if (request.query.sort === 'desc' || request.query.sort === 'asc') {
      products.sort((a, b) => {
        //difference between 2 product price
        let diff = a.price - b.price;

        if (diff === 0) return 0;

        //return 1 || -1
        let sign = Math.abs(diff) / diff;

        return request.query.sort === 'asc' ? sign : -sign;
      });
    }

    //Paginate
    const perPage = 5;
    const curentPage = parseInt(request.query.curPage as any) || 1;
    let pageCount = Math.ceil(products.length / perPage);
    const totalProduct = products.length;

    const fromItem = (curentPage - 1) * perPage;
    const toItem = curentPage * perPage;

    const data = products.slice(fromItem, toItem);

    return {
      data,
      totalProduct,
      curentPage,
      pageCount,
    };
  }
}
