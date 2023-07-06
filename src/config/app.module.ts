import { Module } from '@nestjs/common';
import { HealthController } from '../controller/health.controller';
import { HealthService } from '../service/health.service';
import { InitModule } from './init.module';
import { DbModule } from './db.module';
import { defaultWinstonConfig } from './winston.module';
import { AuthModule } from './auth.module';
import { ChallengeModule } from './challenge.module';

@Module({
  imports: [
    InitModule,
    DbModule.getTypeOrm(),
    defaultWinstonConfig('app'),
    AuthModule,
    ChallengeModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}
