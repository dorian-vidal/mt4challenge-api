import { ApiProperty } from '@nestjs/swagger';

export class IsChallengeDisabledDto {
  @ApiProperty()
  is_disabled: boolean;

  constructor(isDisabled: boolean) {
    this.is_disabled = isDisabled;
  }
}
