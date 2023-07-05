import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { TypeOrmExModule } from './typeorm-ex.module';
import { AccountRepository } from '../repository/account.repository';
import { Module } from '@nestjs/common';
import { AppJwtService } from '../service/app-jwt.service';
import { MailService } from '../service/mail.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([AccountRepository])],
  controllers: [AuthController],
  providers: [AuthService, AppJwtService, MailService],
})
export class AuthModule {}
