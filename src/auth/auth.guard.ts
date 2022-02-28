import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      const jwt = request.cookies['jwt'];

      //extract scope from cookie
      const { scope } = this.jwtService.verify(jwt);

      //check if request with admin role
      const adminLogin = request.path.toString().indexOf('api/admin') >= 0;

      //if role && scope match => return true
      //else => return false
      return (
        (adminLogin && scope === 'admin') ||
        (!adminLogin && scope == 'ambassador')
      );
    } catch (error) {
      return false;
    }
  }
}
