import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly CHALLENGE_DISABLED: string = 'challenge_disabled';
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  /**
   * Check is challenges disabled by admin.
   */
  public async isChallengeDisabled(): Promise<boolean> {
    const result: boolean | null = await this.cacheService.get(
      this.CHALLENGE_DISABLED,
    );
    if (result) {
      return result;
    } else {
      return false;
    }
  }

  /**
   * Change challenge disabled value.
   * @param valueToSet New value to set in cache.
   */
  public async setChallengeDisabled(valueToSet: boolean): Promise<void> {
    return this.cacheService.set(this.CHALLENGE_DISABLED, valueToSet);
  }
}
