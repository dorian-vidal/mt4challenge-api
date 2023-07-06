import { Body, Controller, Get, Headers, Inject, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Logger } from 'winston';
import { GenericResponseDto } from '../dto/generic-response.dto';
import { ChallengeService } from '../service/challenge/challenge.service';
import { NewInstanceDto } from '../dto/challenge/new-instance.dto';
import GeneralEnum from '../enum/general.enum';
import { ErrorEnum } from '../enum/error.enum';

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
    summary: 'Add user instance infos (host and user)',
  })
  @ApiResponse({ status: 201, type: GenericResponseDto })
  @ApiResponse({ status: 401, description: GeneralEnum.NOT_AUTHORIZED })
  @ApiResponse({ status: 401, description: ErrorEnum.SSH_CONNECTION_FAILS })
  public async newInstance(
    @Headers() headers: Headers,
    @Body() body: NewInstanceDto,
  ): Promise<GenericResponseDto> {
    this.logger.info('HTTP Handling newInstance');
    return this.challengeService
      .newInstance(headers, body)
      .then(() => GenericResponseDto.ok());
  }
}
