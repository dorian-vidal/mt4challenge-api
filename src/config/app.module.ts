import { Module } from '@nestjs/common';
import { HealthController } from '../controller/health.controller';
import { HealthService } from '../service/health.service';
import { InitModule } from './init.module';
import { DbModule } from './db.module';
import { defaultWinstonConfig } from './winston.module';
import { AuthModule } from './auth.module';
import { ChallengeModule } from './challenge.module';
import { CacheRegisterModule } from './cache-register.module';
import { CacheService } from '../service/cache.service';

@Module({
  imports: [
    InitModule,
    DbModule.getTypeOrm(),
    CacheRegisterModule.getConfiguration(),
    defaultWinstonConfig(),
    AuthModule,
    ChallengeModule,
  ],
  controllers: [HealthController],
  providers: [HealthService, CacheService],
})
export class AppModule {}
