import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { TypeOrmExModule } from './typeorm-ex.module';
import { AccountRepository } from '../repository/account.repository';
import { Module } from '@nestjs/common';
import { AppJwtService } from '../service/jwt/app-jwt.service';
import { MailService } from '../service/mail.service';
import { ChallengeService } from '../service/challenge/challenge.service';
import { SshService } from '../service/challenge/ssh.service';
import { ChallengeRepository } from '../repository/challenge.repository';
import { PromoRepository } from '../repository/promo.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      AccountRepository,
      ChallengeRepository,
      PromoRepository,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AppJwtService,
    MailService,
    ChallengeService,
    SshService,
  ],
})
export class AuthModule {}
