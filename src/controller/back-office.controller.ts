import { Body, Controller, Get, Headers, Inject, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GenericResponseDto } from '../dto/generic-response.dto';
import { SignInDto } from '../dto/auth/sign-in.dto';
import { Logger } from 'winston';
import { DisabledAuth } from '../decorator/disabled-auth.decorator';


@Controller('back-office')
@ApiTags('back-office')
export class BackOfficeController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Post('/')
  @ApiOperation({
    summary: 'Test Back Office Controller',

  })
  @ApiResponse({ status: 201, type: GenericResponseDto })
  @ApiResponse({ status: 400, description: 'Email is incorrect' })
  @DisabledAuth()
  public async test(@Body() body: SignInDto): Promise<string> {
    return 'Hello World';
  }
}
