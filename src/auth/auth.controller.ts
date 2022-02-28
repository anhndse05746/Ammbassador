import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Controller()
@UseInterceptors(ClassSerializerInterceptor) //Serialization
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post(['admin/register', 'ambassador/register'])
  async register(@Body() body: RegisterDto, @Req() request: Request) {
    const { password_confirm, ...data } = body;

    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Password not match');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    return this.userService.save({
      ...data,
      password: hashedPassword,
      is_ambassador: request.path === 'ambassador/register',
    });
  }

  @Post(['admin/login', 'ambassador/login'])
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    //find user with input email
    const user = await this.userService.findOne({ email });

    //if can't find user with input email => throw exception
    if (!user) {
      throw new NotFoundException();
    }

    //found user with input email
    //compare input password with user's password found
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid Credential');
    }

    //check if login with admin role
    const isAdminLogin = request.path === '/api/admin/login';

    //if login with admin role but user's account has ambassador role
    // => Unauthorized exception
    if (isAdminLogin && user.is_ambassador) {
      throw new UnauthorizedException();
    }

    //everythings good => create jwt and cookie then return
    const jwt = await this.jwtService.signAsync({
      id: user.id,
      scope: isAdminLogin ? 'admin' : 'ambassador',
    });

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'success',
    };
  }

  @UseGuards(AuthGuard)
  @Get(['admin/user', 'ambassador/user'])
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];
    const { id } = await this.jwtService.verifyAsync(cookie);
    console.log(id);
    if (request.path === '/api/admin/user') {
      return await this.userService.findOne({ id });
    }

    const user = await this.userService.findOne({
      id,
      relations: ['orders', 'orders.order_items'],
    });

    return { ...user, revenue: user.revenue };
  }

  @Post(['admin/logout', 'ambassador/logout'])
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success',
    };
  }

  @UseGuards(AuthGuard)
  @Put(['admin/user/info', 'ambassador/user/info'])
  async updateUser(
    @Req() request: Request,
    @Body('email') email: string,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
  ) {
    const jwt = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(jwt);

    await this.userService.update(id, { email, first_name, last_name });

    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(['admin/user/password', 'ambassador/user/password'])
  async updatePassword(
    @Req() request: Request,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('Password not match');
    }

    const jwt = request.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(jwt);

    const hash = await bcrypt.hash(password, 12);

    await this.userService.update(id, { password: hash });

    return this.userService.findOne(id);
  }
}
