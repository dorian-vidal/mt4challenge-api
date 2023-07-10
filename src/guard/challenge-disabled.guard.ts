import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CacheService } from '../service/cache.service';
import { Reflector } from '@nestjs/core';
import GeneralEnum from '../enum/general.enum';
import { ErrorEnum } from '../enum/error.enum';
import { ForbiddenException } from '../exception/forbidden.exception';

@Injectable()
export class ChallengeDisabledGuard implements CanActivate {
  // constructor
  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: CacheService,
  ) {}

  // method
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // challenge disabled guard can be disabled by using `@ChallengeStatusCheckDisabled()` decorator
    const isDisabled = this.reflector.get<boolean>(
      GeneralEnum.DISABLED_CHALLENGE_STATUS_CHECK,
      context.getHandler(),
    );

    if (isDisabled) {
      return true;
    }

    const isChallengeDisabled: boolean =
      await this.cacheService.isChallengeDisabled();
    if (isChallengeDisabled) {
      throw new ForbiddenException(ErrorEnum.CHALLENGE_DISABLED);
    }
    return true;
  }
}
