import { Module } from '@nestjs/common';
import { InitModule } from '../init.module';
import { DbModule } from '../db.module';
import { defaultWinstonConfig } from '../winston.module';
import { BackOfficeAuthModule } from './back-office-auth.module';
import { BackOfficeStudentModule } from './back-office-student.module';
import { BackOfficePromoModule } from './back-office-promo.module';
import { HealthController } from 'src/controller/health.controller';
import { HealthService } from 'src/service/health.service';
import { CacheRegisterModule } from '../cache-register.module';
import { CacheService } from '../../service/cache.service';
import { BackOfficeChallengeModule } from './back-office-challenge.module';

@Module({
  imports: [
    InitModule,
    DbModule.getTypeOrm(),
    CacheRegisterModule.getConfiguration(),
    defaultWinstonConfig(),
    BackOfficeAuthModule,
    BackOfficeStudentModule,
    BackOfficePromoModule,
    BackOfficeChallengeModule,
  ],
  controllers: [HealthController],
  providers: [CacheService, HealthService],
})
export class BackOfficeModule {}
