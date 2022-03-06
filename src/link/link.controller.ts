import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { AuthService } from './../auth/auth.service';
import { Product } from './../product/product';
import { Link } from './link';
import { Order } from './../order/order';

@Controller()
export class LinkController {
  constructor(
    private linkService: LinkService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('admin/user/:id/link')
  async all(@Param('id') id: number) {
    return this.linkService.find({
      user: id,
      relations: ['orders'],
    });
  }

  @UseGuards(AuthGuard)
  @Post('ambassador/link')
  async link(@Body('products') products: number[], @Req() request: Request) {
    const user = await this.authService.user(request);

    return this.linkService.save({
      code: Math.random().toString(36).substring(6),
      user,
      products: products.map((id) => ({ id })),
    });
  }

  @UseGuards(AuthGuard)
  @Get('ambassador/stats')
  async links(@Req() request: Request) {
    const user = this.authService.user(request);

    const links: Link[] = await this.linkService.find({
      user,
      relations: ['orders'],
    });

    return links.map((link) => {
      const completedOrders: Order[] = link.orders.filter((o) => o.complete);

      return {
        code: link,
        count: completedOrders.length,
        revenue: completedOrders.reduce((s, o) => s + o.ambassador_revenue, 0),
      };
    });
  }
}
