import { Inject, Injectable } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { AdminSignInDto } from '../dto/auth/sign-in.dto';
import { BackOfficeJwtService } from './jwt/back-office-jwt.service';
import { AppEndpointsEnum } from '../enum/app-endpoints.enum';
import { MailService } from './mail.service';
import { Logger } from 'winston';
import { AdminEntity } from '../entity/admin.entity';

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
    
    // check if account already exists
    const user: AdminEntity = await this.adminRepository.findOneBy({
      email: body.email.toLowerCase(),
    });
    let url: string;
    
    // if exists -> send URL to sign-in
    if (user) {
      // generate sign-in JWT
      const jwt: string = this.backOfficeJwtService.generateToken({ sub: user.id });
      url = AppEndpointsEnum.DASHBOARD + `?token=${jwt}`;
      this.logger.info(`Existing account case for auth, email=${body.email}`);
    }

    // send email
    await this.mailService.welcomeAdmin(body.email.toLowerCase(), url);
    this.logger.info(`Successfully send login mail, email=${body.email}`);
  }

//   /**
//    * Register new user en return JWT.
//    * @param body Request body, it should contain user infos.
//    */
//   public async register(body: SignUpDto): Promise<TokenDto> {
//     // check that given promo exists
//     const promo: PromoEntity = await this.promoRepository.findOneBySlug(
//       body.promo_slug,
//     );
//     if (!promo) {
//       this.logger.error(
//         `Promo not found when register, given=${body.promo_slug}`,
//       );
//       throw new BadRequestException(ErrorEnum.INVALID_PROMO_SLUG);
//     }

//     // check if account already exists
//     const account: AccountEntity = await this.accountRepository.findOneBy({
//       email: body.email.toLowerCase(),
//     });

//     // if user not already exists
//     // should save into database
//     if (!account) {
//       const newAccountId: string =
//         await this.accountRepository.insertNewAndGetID(
//           body.email.toLowerCase(),
//           body.first_name,
//           body.last_name,
//           body.promo_slug,
//         );
//       const tokenDto: TokenDto = new TokenDto();
//       tokenDto.token = this.appJwtService.generateToken({ sub: newAccountId });
//       this.logger.info(`Successfully logged user, email=${body.email}`);

//       return tokenDto;
//     } else {
//       this.logger.warn(
//         `User already exists, cannot register again, email=${body.email}`,
//       );
//       return null;
//     }
//   }
}
