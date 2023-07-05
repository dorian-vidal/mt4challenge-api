import { Injectable } from '@nestjs/common';
import { HealthDto } from '../dto/app/health.dto';
import * as fs from 'fs';

@Injectable()
export class HealthService {
  /**
   * Get health and app version.
   */
  public async health(): Promise<HealthDto> {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return new HealthDto(packageJson.version);
  }
}
