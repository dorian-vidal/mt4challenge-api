import { Controller, Inject, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Logger } from 'winston';
import { DisabledAuth } from '../../decorator/disabled-auth.decorator';

@Controller('back-office')
@ApiTags('back-office')
export class BackOfficeController {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  @Get('/')
  @ApiOperation({
    summary: 'Test Back Office Controller',
  })
  @DisabledAuth()
  public async test(): Promise<string> {
    return 'Hello World';
  }
}
