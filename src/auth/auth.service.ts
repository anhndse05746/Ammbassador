import { Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  //Authenticate user using cookie
  async user(@Req() request: Request) {
    const jwt = await this.jwtService.verify(request.cookies['jwt']);

    const { id } = jwt;

    return await this.userService.findOne({ id });
  }
}
