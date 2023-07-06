import { Module } from '@nestjs/common';
import { ChallengeService } from '../service/challenge/challenge.service';
import { ChallengeController } from '../controller/challenge.controller';
import { SshService } from '../service/challenge/ssh.service';
import { TypeOrmExModule } from './typeorm-ex.module';
import { AccountRepository } from '../repository/account.repository';
import { AppJwtService } from '../service/app-jwt.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([AccountRepository])],
  controllers: [ChallengeController],
  providers: [ChallengeService, SshService, AppJwtService],
})
export class ChallengeModule {}
