import { Headers, Injectable } from '@nestjs/common';
import { NewInstanceDto } from '../../dto/challenge/new-instance.dto';
import { SshService } from './ssh.service';
import { AccountRepository } from '../../repository/account.repository';
import { JwtInterface } from '../../interface/jwt.interface';
import { AppJwtService } from '../app-jwt.service';
import { ChallengeDto } from '../../dto/challenge/challenge.dto';
import { ChallengeRepository } from '../../repository/challenge.repository';
import { ChallengeEntity } from '../../entity/challenge.entity';
import { AccountEntity } from '../../entity/account.entity';
import { BadRequestException } from '../../exception/bad-request.exception';
import { PreconditionFailedException } from '../../exception/precondition-failed.exception';
import { ChallengeWithErrorDto } from '../../dto/challenge/challenge-with-error.dto';

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
    return this.getUserCurrentChallengeDto(me.sub);
  }

  public async getUserCurrentChallengeDto(
    userId: string,
  ): Promise<ChallengeDto> {
    const challengeDto: ChallengeDto = new ChallengeDto();

    // get user current challenge
    const challengeScore: number | null =
      await this.challengeRepository.getUserCurrentScore(userId);
    if (challengeScore === 20) {
      return null;
    }

    // if user have score, retrieve next challenge
    if (challengeScore) {
      const nextChallenge: ChallengeEntity =
        await this.challengeRepository.getChallengeAfter(challengeScore);
      challengeDto.current_score = challengeScore;
      challengeDto.description = nextChallenge.description;
      return challengeDto;
    }

    // if user have not already done one challenge
    // should send first challenge
    const firstChallenge = await this.challengeRepository.getFirstChallenge();
    challengeDto.description = firstChallenge.description;
    challengeDto.current_score = 0;
    return challengeDto;
  }

  public async runChallenges(headers: Headers): Promise<ChallengeDto> {
    const me: JwtInterface = this.appJwtService.getJwtFromHeaders(headers);
    const userId: string = me.sub;
    let score = 0;

    // retrieve all challenges and user instance infos
    const challenges: ChallengeEntity[] =
      await this.challengeRepository.findAll();
    const userInstanceInfos: AccountEntity =
      await this.accountRepository.getInstanceInfosById(userId);
    if (!userInstanceInfos?.instance_ip || !userInstanceInfos?.instance_user) {
      throw new PreconditionFailedException();
    }

    // erase all achieved challenges for user
    await this.challengeRepository.deleteAllAchievedChallengeForUser(userId);

    // test challenge through ssh
    for (const challenge of challenges) {
      try {
        await this.sshService.runChallenge(
          userInstanceInfos.instance_ip,
          userInstanceInfos.instance_user,
          challenge,
        );

        // if challenge have not triggered error, should save account challenge
        score = challenge.score;
        await this.challengeRepository.saveAchievedChallenge(
          userId,
          challenge.id,
        );
      } catch (error) {
        const challengeToDo: ChallengeWithErrorDto =
          new ChallengeWithErrorDto();
        challengeToDo.description = challenge.description;
        challengeToDo.current_score = score;
        challengeToDo.error = error.message;
        return challengeToDo;
      }
    }

    // case user have finished!
    return null;
  }
}
