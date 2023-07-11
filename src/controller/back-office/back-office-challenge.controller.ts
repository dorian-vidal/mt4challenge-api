import { Body, Controller, Get, Inject, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from 'winston';
import { BackOfficeChallengeService } from '../../service/back-office-challenge.service';
import { IsChallengeDisabledDto } from '../../dto/bo/is-challenge-disabled.dto';
import GeneralEnum from '../../enum/general.enum';
import { GenericResponseDto } from '../../dto/generic-response.dto';

@Controller('back-office/challenge')
@ApiTags('challenge')
export class BackOfficeChallengeController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly backOfficeChallengeService: BackOfficeChallengeService,
  ) {}

  @Get('is-disabled')
  @ApiOperation({
    summary: 'Check if challenge is disabled',
  })
  @ApiResponse({ status: 201, type: IsChallengeDisabledDto })
  @ApiResponse({ status: 401, description: GeneralEnum.NOT_AUTHORIZED })
  public async boIsDisabled(): Promise<IsChallengeDisabledDto> {
    this.logger.info(`HTTP Handling boIsDisabled`);
    return this.backOfficeChallengeService.isChallengeDisabled();
  }

  @Put('set-is-disabled')
  @ApiOperation({
    summary: 'Set is challenge disabled',
  })
  @ApiResponse({ status: 201, type: GenericResponseDto })
  @ApiResponse({ status: 401, description: GeneralEnum.NOT_AUTHORIZED })
  @ApiBody({ type: IsChallengeDisabledDto })
  public async setIsDisabled(
    @Body() body: IsChallengeDisabledDto,
  ): Promise<GenericResponseDto> {
    this.logger.info(
      `HTTP Handling setIsDisabled, isDisabled=${body.is_disabled}`,
    );
    return this.backOfficeChallengeService
      .setIsChallengeDisabledState(body)
      .then(() => GenericResponseDto.ok());
  }
}
