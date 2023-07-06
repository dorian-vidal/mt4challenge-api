import { Injectable, Headers } from '@nestjs/common';
import { NewInstanceDto } from '../../dto/challenge/new-instance.dto';
import { SshService } from './ssh.service';
import { AccountRepository } from '../../repository/account.repository';
import { JwtInterface } from '../../interface/jwt.interface';
import { AppJwtService } from '../app-jwt.service';

@Injectable()
export class ChallengeService {
  constructor(
    private readonly sshService: SshService,
    private readonly accountRepository: AccountRepository,
    private readonly appJwtService: AppJwtService,
  ) {}

  public async newInstance(
    headers: Headers,
    body: NewInstanceDto,
  ): Promise<void> {
    // if connection test fails, it will trigger an error
    await this.sshService.testConnection(body.host, body.username);

    // save it into database
    const me: JwtInterface = this.appJwtService.getJwtFromHeaders(headers);
    await this.accountRepository.updateInstance(
      me.sub,
      body.host,
      body.username,
    );
  }
}
