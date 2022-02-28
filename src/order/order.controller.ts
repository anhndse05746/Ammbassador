import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Get('admin/orders')
  @UseInterceptors(ClassSerializerInterceptor)
  async all() {
    return this.orderService.find({ relations: ['order_items'] });
  }
}
