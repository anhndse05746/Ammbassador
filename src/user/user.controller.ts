import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  UseGuards,
  Res,
} from '@nestjs/common';
import { RedisService } from '../shared/redis.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user';
import { UserService } from './user.service';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {}

  @Get('admin/ambassador')
  ambassador() {
    return this.userService.find({
      is_ambassador: true,
    });
  }

  @Get('ambassador/rankings')
  async ranking(@Res() response: Response) {
    const client = this.redisService.getClient();

    //Get sorted set of redis
    client.zrevrangebyscore(
      'rankings',
      '+inf',
      '-inf',
      'withscores',
      (err, rs) => {
        let score;
        response.send(
          rs.reduce((o, r) => {
            if (isNaN(parseInt(r))) {
              return {
                ...o,
                [r]: score,
              };
            } else {
              score = parseInt(r);
              return o;
            }
          }, {}),
        );
      },
    );
  }
}
