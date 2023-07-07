import { ApiProperty } from '@nestjs/swagger';
import { ChallengeDto } from './challenge.dto';

export class ChallengeWithErrorDto extends ChallengeDto {
  @ApiProperty({ example: 'cat: ./byebyeworld.txt: No such file or directory' })
  error: string;
}
