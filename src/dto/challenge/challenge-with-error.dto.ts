import { ApiProperty } from '@nestjs/swagger';
import { ChallengeDto } from './challenge.dto';
import { ChallengeEntity } from '../../entity/challenge.entity';

export class ChallengeWithErrorDto extends ChallengeDto {
  @ApiProperty({ example: 'cat: ./byebyeworld.txt: No such file or directory' })
  error: string;

  constructor(challenge: ChallengeEntity, score: number, error: any) {
    super();
    this.description = challenge.description;
    this.current_score = score;
    this.error = error.message;
  }
}
