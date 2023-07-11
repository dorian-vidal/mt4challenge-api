import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { CacheService } from './cache.service';
import { IsChallengeDisabledDto } from '../dto/bo/is-challenge-disabled.dto';

@Injectable()
export class BackOfficeChallengeService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Get is challenge disabled.
   */
  public async isChallengeDisabled(): Promise<IsChallengeDisabledDto> {
    return new IsChallengeDisabledDto(
      await this.cacheService.isChallengeDisabled(),
    );
  }

  /**
   * Set is challenge disabled state from cache.
   * @param body Body request contains `is_challenge`.
   */
  public async setIsChallengeDisabledState(
    body: IsChallengeDisabledDto,
  ): Promise<void> {
    await this.cacheService.setChallengeDisabled(body.is_disabled);
  }
}
