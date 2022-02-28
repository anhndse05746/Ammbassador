import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('admin/ambassador')
  ambassador() {
    return this.userService.find({
      is_ambassador: true,
    });
  }
}
