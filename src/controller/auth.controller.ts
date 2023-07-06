import { Body, Controller, Get, Headers, Inject, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { GenericResponseDto } from '../dto/generic-response.dto';
import { SignInDto } from '../dto/auth/sign-in.dto';
import { Logger } from 'winston';
import { DisabledAuth } from '../decorator/disabled-auth.decorator';
import { MeDto } from '../dto/auth/me.dto';
import GeneralEnum from '../enum/general.enum';
import { SignUpDto } from '../dto/auth/sign-up.dto';
import { TokenDto } from '../dto/auth/token.dto';
import { ErrorEnum } from '../enum/error.enum';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Send email to user containing app sign-in or register URL',
  })
  @ApiResponse({ status: 201, type: GenericResponseDto })
  @ApiResponse({ status: 400, description: 'Email is incorrect' })
  @ApiBody({ type: SignInDto })
  @DisabledAuth()
  public async login(@Body() body: SignInDto): Promise<GenericResponseDto> {
    this.logger.info('HTTP Handling login, email=%s', body.email);
    return this.authService.login(body).then(() => GenericResponseDto.ok());
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register new user, will return JWT token in data response field',
  })
  @ApiResponse({
    status: 201,
    type: GenericResponseDto,
    description: 'If user already exists, response will be null',
  })
  @ApiResponse({ status: 400, description: ErrorEnum.INVALID_EMAIL })
  @ApiResponse({ status: 400, description: ErrorEnum.INVALID_FIRST_NAME })
  @ApiResponse({ status: 400, description: ErrorEnum.INVALID_LAST_NAME })
  @ApiBody({ type: SignUpDto })
  @DisabledAuth()
  public async register(@Body() body: SignUpDto): Promise<TokenDto> {
    this.logger.info('HTTP Handling register, email=%s', body.email);
    return this.authService.register(body);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get user infos such as email, first name, last name and score',
  })
  @ApiResponse({ status: 200, type: MeDto })
  @ApiResponse({ status: 401, description: GeneralEnum.NOT_AUTHORIZED })
  @ApiBearerAuth()
  public async me(@Headers() headers: Headers): Promise<MeDto> {
    this.logger.info('HTTP handling me');
    return this.authService.me(headers);
  }
}
