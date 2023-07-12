import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BackOfficeAuthService } from '../../service/bo/back-office-auth.service';
import { GenericResponseDto } from '../../dto/generic-response.dto';
import { AdminSignInDto } from '../../dto/auth/sign-in.dto';
import { Logger } from 'winston';
import { DisabledAuth } from '../../decorator/disabled-auth.decorator';

@Controller('back-office/auth')
@ApiTags('auth')
export class BackOfficeAuthController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly backOfficeAuthService: BackOfficeAuthService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Send an email to the user to log in to the back office',
  })
  @ApiResponse({ status: 201, type: GenericResponseDto })
  @ApiResponse({ status: 400, description: 'Email is incorrect' })
  @ApiBody({ type: AdminSignInDto })
  @DisabledAuth()
  public async boLogin(
    @Body() body: AdminSignInDto,
  ): Promise<GenericResponseDto> {
    this.logger.info(`HTTP Handling boLogin, email=${body.email}`);
    return this.backOfficeAuthService
      .login(body)
      .then(() => GenericResponseDto.ok());
  }
}
