import { JwtService } from '@nestjs/jwt';
import { IncomingHttpHeaders } from 'http';
import { JwtInterface } from '../interface/jwt.interface';
import { UnauthorizedException } from '@nestjs/common';
import GeneralEnum from '../enum/general.enum';

export class JWTUtil {
  // values
  private readonly jwt: JwtService;

  // constructor
  constructor(secret: string, expiresIn: string) {
    this.jwt = new JwtService({
      signOptions: {
        algorithm: 'HS512',
        expiresIn: expiresIn,
      },
      secret: secret,
    });
  }

  public generateToken(payload: JwtInterface): string {
    return this.jwt.sign(payload as unknown as Record<string, string>);
  }

  public getJwtFromHeaders(
    headers: Headers | IncomingHttpHeaders,
  ): JwtInterface {
    // get authorization header
    let authorization = headers[GeneralEnum.AUTHORIZATION_HEADER];

    // if token does not exist in headers or does not start with "Bearer "
    if (
      !authorization ||
      !authorization.startsWith(GeneralEnum.BEARER_PREFIX)
    ) {
      throw new UnauthorizedException();
    }

    // get only after "Bearer "
    authorization = authorization.substring(7, authorization.length);
    return this.getJwtFromPlainToken(authorization);
  }

  private getJwtFromPlainToken(token: string): JwtInterface {
    try {
      return this.jwt.verify(token) as unknown as JwtInterface;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
