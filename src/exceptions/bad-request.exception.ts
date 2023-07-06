import { HttpException, HttpStatus } from '@nestjs/common';
import GeneralEnum from '../enum/general.enum';

export class BadRequestException extends HttpException {
  constructor(message?: string) {
    super(message || GeneralEnum.BAD_REQUEST, HttpStatus.BAD_REQUEST);
  }
}
