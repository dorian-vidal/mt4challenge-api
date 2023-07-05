import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import GeneralEnum from '../enum/general.enum';
import { JWTUtil } from '../util/jwt.util';

@Injectable()
export class AuthGuard implements CanActivate {
  // constructor
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JWTUtil,
  ) {}

  // method
  canActivate(context: ExecutionContext): boolean {
    // auth guard can be disabled by using `@AuthDisabled()` decorator
    const isDisabled = this.reflector.get<boolean>(
      GeneralEnum.DISABLED_AUTH,
      context.getHandler(),
    );

    if (isDisabled) {
      return true;
    }

    // get a jwt from headers
    const headers = context.switchToHttp().getRequest<Request>().headers;
    const jwt = this.jwtService.getJwtFromHeaders(headers);

    return jwt != undefined;
  }
}
