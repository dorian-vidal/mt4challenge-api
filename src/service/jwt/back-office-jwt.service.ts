import { JWTUtil } from '../../util/jwt.util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BackOfficeJwtService extends JWTUtil {
  constructor() {
    super(process.env.BO, '5h');
  }
}
