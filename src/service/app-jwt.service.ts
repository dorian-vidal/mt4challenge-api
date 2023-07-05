import { JWTUtil } from '../util/jwt.util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppJwtService extends JWTUtil {
  constructor() {
    super(process.env.APP_JWT_PREFIX, '5h');
  }
}
