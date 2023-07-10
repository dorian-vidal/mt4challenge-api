import { HttpException, HttpStatus } from '@nestjs/common';
import GeneralEnum from '../enum/general.enum';

export class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(message || GeneralEnum.FORBIDDEN, HttpStatus.FORBIDDEN);
  }
}
