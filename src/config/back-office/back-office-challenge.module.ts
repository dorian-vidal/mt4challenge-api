import { Module } from '@nestjs/common';
import { BackOfficeChallengeController } from '../../controller/back-office/back-office-challenge.controller';
import { CacheService } from '../../service/cache.service';
import { BackOfficeChallengeService } from '../../service/bo/back-office-challenge.service';

@Module({
  controllers: [BackOfficeChallengeController],
  providers: [BackOfficeChallengeService, CacheService],
})
export class BackOfficeChallengeModule {}
