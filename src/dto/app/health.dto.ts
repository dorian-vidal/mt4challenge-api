import GeneralEnum from '../../enum/general.enum';
import { ApiProperty } from '@nestjs/swagger';

export class HealthDto {
  @ApiProperty()
  state: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  challenge_disabled: boolean;

  constructor(version: string, isChallengeDisabled: boolean) {
    this.state = GeneralEnum.OK;
    this.version = version;
    this.challenge_disabled = isChallengeDisabled;
  }
}
