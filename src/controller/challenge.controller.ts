import { Body, Controller, Headers, Inject, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Logger } from 'winston';
import { ChallengeService } from '../service/challenge/challenge.service';
import { NewInstanceDto } from '../dto/challenge/new-instance.dto';
import GeneralEnum from '../enum/general.enum';
import { ChallengeDto } from '../dto/challenge/challenge.dto';

@Controller('challenge')
@ApiTags('challenge')
@ApiBearerAuth()
export class ChallengeController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly challengeService: ChallengeService,
  ) {}

  @Patch('new-instance')
  @ApiOperation({
    summary: 'Add user instance infos (host and username)',
  })
  @ApiResponse({
    status: 201,
    description: 'Will send current challenge to do',
    type: ChallengeDto,
  })
  @ApiResponse({
    status: 401,
    description:
      'Will display SSH error returns, example: ssh: handshake failed: ssh: unable to authenticate',
  })
  @ApiResponse({ status: 401, description: GeneralEnum.NOT_AUTHORIZED })
  public async newInstance(
    @Headers() headers: Headers,
    @Body() body: NewInstanceDto,
  ): Promise<ChallengeDto> {
    this.logger.info('HTTP Handling newInstance');
    return this.challengeService.newInstance(headers, body);
  }

  @Post('run-challenges')
  @ApiOperation({
    summary: 'Execute all user challenges',
  })
  @ApiResponse({
    status: 201,
    description:
      'If one challenge is not completed, description and current score will be send. If response body is null, that means that user have successfully finished!',
    type: ChallengeDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Will display SSH console error returns',
  })
  @ApiResponse({
    status: 412,
    description: 'User have not fill instance host and user',
  })
  public async runChallenges(
    @Headers() headers: Headers,
  ): Promise<ChallengeDto> {
    this.logger.info('HTTP Handling runChallenges');
    return this.challengeService.runChallenges(headers);
  }
}
