import { Inject, Injectable } from '@nestjs/common';
import { AdminRepository } from '../../repository/admin.repository';
import { AdminSignInDto } from '../../dto/auth/sign-in.dto';
import { BackOfficeJwtService } from '../jwt/back-office-jwt.service';
import { AppEndpointsEnum } from '../../enum/app-endpoints.enum';
import { MailService } from '../mail.service';
import { Logger } from 'winston';
import { AdminEntity } from '../../entity/admin.entity';
import { ForbiddenException } from '../../exception/forbidden.exception';

@Injectable()
export class BackOfficeAuthService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly adminRepository: AdminRepository,
    private readonly backOfficeJwtService: BackOfficeJwtService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Send login (if user exists).
   * @param body Request body, it should contain email .
   */
  public async login(body: AdminSignInDto): Promise<void> {
    // check if admin account already exists
    const user: AdminEntity = await this.adminRepository.findOneBy({
      email: body.email.toLowerCase(),
    });
    let url: string;

    // if exists -> send URL to sign-in
    if (user) {
      // generate sign-in JWT
      const jwt: string = this.backOfficeJwtService.generateToken({
        sub: user.id,
      });
      url = AppEndpointsEnum.DASHBOARD + `?token=${jwt}`;
      this.logger.info(
        `Existing admin account case for auth, email=${body.email}`,
      );

      // send email
      await this.mailService.welcomeAdmin(body.email.toLowerCase(), url);
      this.logger.info(
        `Successfully send login mail for admin, email=${body.email}`,
      );
    } else {
      this.logger.warn(`Admin account doesn't exists, email=${body.email}`);
      throw new ForbiddenException();
    }
  }
}
