import { HttpException, HttpStatus } from '@nestjs/common';
import GeneralEnum from '../enum/general.enum';

export class UnauthorizedException extends HttpException {
  constructor(reason?: string) {
    super(reason || GeneralEnum.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}
