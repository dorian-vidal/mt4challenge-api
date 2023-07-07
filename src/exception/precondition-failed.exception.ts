import { HttpException, HttpStatus } from '@nestjs/common';
import GeneralEnum from '../enum/general.enum';

export class PreconditionFailedException extends HttpException {
  constructor(message?: string) {
    super(message || GeneralEnum.PRECONDITION_FAILED, HttpStatus.PRECONDITION_FAILED);
  }
}
