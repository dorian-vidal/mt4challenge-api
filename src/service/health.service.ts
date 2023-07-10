import { Injectable } from '@nestjs/common';
import { HealthDto } from '../dto/app/health.dto';
import * as fs from 'fs';
import { CacheService } from './cache.service';

@Injectable()
export class HealthService {
  constructor(private readonly cacheService: CacheService) {}
  /**
   * Get health and app version.
   */
  public async health(): Promise<HealthDto> {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const isChallengeDisabled: boolean =
      await this.cacheService.isChallengeDisabled();
    return new HealthDto(packageJson.version, isChallengeDisabled);
  }
}
