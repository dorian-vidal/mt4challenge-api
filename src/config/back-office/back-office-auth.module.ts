import { BackOfficeAuthController } from '../../controller/back-office/back-office-auth.controller';
import { BackOfficeAuthService } from '../../service/back-office-auth.service';
import { TypeOrmExModule } from '../typeorm-ex.module';
import { AdminRepository } from '../../repository/admin.repository';
import { Module } from '@nestjs/common';
import { BackOfficeJwtService } from '../../service/jwt/back-office-jwt.service';
import { MailService } from '../../service/mail.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([AdminRepository])],
  controllers: [BackOfficeAuthController],
  providers: [BackOfficeAuthService, BackOfficeJwtService, MailService],
})
export class BackOfficeAuthModule {}
