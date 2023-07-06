import { Headers, Injectable } from '@nestjs/common';
import { NewInstanceDto } from '../../dto/challenge/new-instance.dto';
import { SshService } from './ssh.service';
import { AccountRepository } from '../../repository/account.repository';
import { JwtInterface } from '../../interface/jwt.interface';
import { AppJwtService } from '../app-jwt.service';
import { ChallengeDto } from '../../dto/challenge/challenge.dto';
import { ChallengeRepository } from '../../repository/challenge.repository';
import { ChallengeEntity } from '../../entity/challenge.entity';

@Injectable()
export class ChallengeService {
  constructor(
    private readonly sshService: SshService,
    private readonly accountRepository: AccountRepository,
    private readonly challengeRepository: ChallengeRepository,
    private readonly appJwtService: AppJwtService,
  ) {}

  public async newInstance(
    headers: Headers,
    body: NewInstanceDto,
  ): Promise<ChallengeDto> {
    // if connection test fails, it will trigger an error
    await this.sshService.testConnection(body.host, body.username);

    // save it into database
    const me: JwtInterface = this.appJwtService.getJwtFromHeaders(headers);
    await this.accountRepository.updateInstance(
      me.sub,
      body.host,
      body.username,
    );

    // retrieve current score and user challenge to do
    return this.getUserCurrentChallenge(me.sub);
  }

  public async getUserCurrentChallenge(userId: string): Promise<ChallengeDto> {
    const challengeDto: ChallengeDto = new ChallengeDto();

    // get user current challenge
    const challenge: ChallengeEntity | null =
      await this.challengeRepository.getUserCurrentChallenge(userId);

    if (challenge) {
      challengeDto.description = challenge.description;
      const userLastAchievedChallenge =
        await this.challengeRepository.getUserLastAchievedChallenge(userId);
      challengeDto.current_score = userLastAchievedChallenge.score;
    }

    // if user have not already done one challenge in progress
    // should send first challenge
    if (!challenge) {
      const firstChallenge: ChallengeEntity =
        await this.challengeRepository.getFirstChallenge();
      challengeDto.description = firstChallenge.description;
      challengeDto.current_score = 0;
    }

    return challengeDto;
  }
}
