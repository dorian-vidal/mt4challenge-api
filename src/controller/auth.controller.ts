import { Body, Controller, Get, Headers, Inject, Post } from "@nestjs/common";
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
import { MeDto } from "../dto/auth/me.dto";
import GeneralEnum from "../enum/general.enum";

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
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

  @Get('me')
  @ApiOperation({
    summary: 'Get user infos such as email, first name, last name and score',
  })
  @ApiResponse({ status: 201, type: MeDto })
  @ApiResponse({ status: 401, description: GeneralEnum.NOT_AUTHORIZED })
  public async me(@Headers() headers: Headers): Promise<MeDto> {
    this.logger.info('HTTP handling me');
    return this.authService.me(headers);
  }
}
