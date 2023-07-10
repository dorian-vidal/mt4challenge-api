import { Headers, Inject, Injectable } from '@nestjs/common';
import { NewInstanceDto } from '../../dto/challenge/new-instance.dto';
import { SshService } from './ssh.service';
import { AccountRepository } from '../../repository/account.repository';
import { JwtInterface } from '../../interface/jwt.interface';
import { AppJwtService } from '../jwt/app-jwt.service';
import { ChallengeDto } from '../../dto/challenge/challenge.dto';
import { ChallengeRepository } from '../../repository/challenge.repository';
import { ChallengeEntity } from '../../entity/challenge.entity';
import { AccountEntity } from '../../entity/account.entity';
import { PreconditionFailedException } from '../../exception/precondition-failed.exception';
import { ChallengeWithErrorDto } from '../../dto/challenge/challenge-with-error.dto';
import { Logger } from 'winston';

@Injectable()
export class ChallengeService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly sshService: SshService,
    private readonly accountRepository: AccountRepository,
    private readonly challengeRepository: ChallengeRepository,
    private readonly appJwtService: AppJwtService,
  ) {}

  /**
   * Create new instance for user.
   * @param headers Request headers, it should contain JWT in <code>Authorization</code>.
   * @param body Body request containing instance host and username.
   */
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

  /**
   * Get user current challenge as DTO.
   * @param userId User ID.
   */
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

  /**
   * Run all challenge for a given user.
   * @param headers Request headers, it should contain JWT in <code>Authorization</code>.
   */
  public async runChallenges(headers: Headers): Promise<ChallengeDto> {
    const me: JwtInterface = this.appJwtService.getJwtFromHeaders(headers);
    const userId: string = me.sub;

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

    return this.processChallengesRunning(userInstanceInfos, challenges);
  }

  /**
   * Run all challenges and check for possible errors.
   * @param userInstanceInfos User info contains ID, instance IP and username.
   * @param challenges List of all challenges to run (through SSH).
   */
  private async processChallengesRunning(
    userInstanceInfos: AccountEntity,
    challenges: ChallengeEntity[],
  ): Promise<ChallengeWithErrorDto | null> {
    let score = 0;

    for (const challenge of challenges) {
      try {
        // execute trough SSH
        await this.sshService.runChallenge(
          userInstanceInfos.instance_ip,
          userInstanceInfos.instance_user,
          challenge,
        );

        // if challenge have not triggered error, should save achieved challenge
        score = challenge.score;
        await this.challengeRepository.saveAchievedChallenge(
          userInstanceInfos.id,
          challenge.id,
        );
      } catch (error: any) {
        // if a challenge fails, should return error
        return new ChallengeWithErrorDto(challenge, score, error);
      }
    }

    // case when user have successfully finished all challenges
    this.logger.info(
      `User have successfully finished all challenges, id=${userInstanceInfos.id}`,
    );
    return null;
  }
}
