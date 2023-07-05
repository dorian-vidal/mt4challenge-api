import GeneralEnum from '../../enum/general.enum';
import { ApiProperty } from '@nestjs/swagger';

export class HealthDto {
  @ApiProperty()
  state: string;

  @ApiProperty()
  version: string;

  constructor(version: string) {
    this.state = GeneralEnum.OK;
    this.version = version;
  }
}
