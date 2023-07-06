import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from '../../entity/account.entity';

export class MeDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty({ description: 'User score out of 20' })
  score: number;

  @ApiProperty()
  ssh_public_key_to_add: string;

  constructor(account: AccountEntity, sshPublicKeyToAdd: string) {
    this.email = account.email;
    this.first_name = account.first_name;
    this.last_name = account.last_name;
    this.score = 0;
    this.ssh_public_key_to_add = sshPublicKeyToAdd;
  }
}
