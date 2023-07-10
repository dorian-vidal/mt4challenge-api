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

  /**
   * Generate JSON Web Token.
   * @param payload Object data to store in JSON Web Token.
   */
  public generateToken(payload: JwtInterface): string {
    return this.jwt.sign(payload as unknown as Record<string, string>);
  }

  /**
   * Retrieve JSON Web Token from given request headers
   * @param headers Request headers, it should contain JWT in <code>Authorization</code>.
   */
  public getJwtFromHeaders(
    headers: Headers | IncomingHttpHeaders,
  ): JwtInterface {
    // get authorization header
    let authorization = headers[GeneralEnum.AUTHORIZATION_HEADER];

    // if token does not exist in headers or does not start with "Bearer "
    if (authorization?.startsWith(GeneralEnum.BEARER_PREFIX)) {
      throw new UnauthorizedException();
    }

    // remove "Bearer " text
    authorization = authorization.substring(7, authorization.length);
    return this.getJwtFromPlainToken(authorization);
  }

  /**
   * Get a JSON Web Token Interface from plain token
   * @param token Plain token as `text` format.
   */
  private getJwtFromPlainToken(token: string): JwtInterface {
    try {
      return this.jwt.verify(token) as unknown as JwtInterface;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
