import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from '../../entity/account.entity';
import { ChallengeDto } from '../challenge/challenge.dto';

export class MeDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  ssh_public_key_to_add: string;

  @ApiProperty()
  challenge_to_do: ChallengeDto;

  constructor(
    account: AccountEntity,
    sshPublicKeyToAdd: string,
    challengeDto: ChallengeDto,
  ) {
    this.email = account.email;
    this.first_name = account.first_name;
    this.last_name = account.last_name;
    this.ssh_public_key_to_add = sshPublicKeyToAdd;
    this.challenge_to_do = challengeDto;
  }
}
