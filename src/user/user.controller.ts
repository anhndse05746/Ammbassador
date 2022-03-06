import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('admin/ambassador')
  ambassador() {
    return this.userService.find({
      is_ambassador: true,
    });
  }

  @Get('ambassador/rankings')
  async ranking() {
    const ambassador: User[] = await this.userService.find({
      is_ambassador: true,
      relations: ['orders', 'orders.order_items'],
    });

    return ambassador.map((ambassador) => {
      return {
        name: ambassador.name,
        revenue: ambassador.revenue,
      };
    });
  }
}
