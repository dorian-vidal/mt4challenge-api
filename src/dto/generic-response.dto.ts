import GeneralEnum from '../enum/general.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GenericResponseDto {
  @ApiProperty({ example: GeneralEnum.OK })
  public data: string;

  constructor(data: string) {
    this.data = data;
  }

  public static ok() {
    return new GenericResponseDto(GeneralEnum.OK);
  }
}
