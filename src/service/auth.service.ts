import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../repository/account.repository';
import { SignInDto } from '../dto/auth/sign-in.dto';
import { AppJwtService } from './jwt/app-jwt.service';
import { AppEndpointsEnum } from '../enum/app-endpoints.enum';
import { MailService } from './mail.service';
import { Logger } from 'winston';
import { MeDto } from '../dto/auth/me.dto';
import { JwtInterface } from '../interface/jwt.interface';
import { AccountEntity } from '../entity/account.entity';
import { SignUpDto } from '../dto/auth/sign-up.dto';
import { TokenDto } from '../dto/auth/token.dto';
import { ChallengeService } from './challenge/challenge.service';
import { ChallengeDto } from '../dto/challenge/challenge.dto';
import { PromoRepository } from '../repository/promo.repository';
import { BadRequestException } from '../exception/bad-request.exception';
import { ErrorEnum } from '../enum/error.enum';
import { PromoEntity } from '../entity/promo.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly accountRepository: AccountRepository,
    private readonly appJwtService: AppJwtService,
    private readonly mailService: MailService,
    private readonly challengeService: ChallengeService,
    private readonly promoRepository: PromoRepository,
  ) {}

  /**
   * Send login (if user exists) or register email.
   * @param body Request body, it should contain email and promo slug.
   */
  public async login(body: SignInDto): Promise<void> {
    // check if account already exists
    const account: AccountEntity = await this.accountRepository.findOneBy({
      email: body.email.toLowerCase(),
    });
    let url: string;

    // if exists -> send URL to sign-in
    if (account) {
      // generate sign-in JWT
      const jwt: string = this.appJwtService.generateToken({ sub: account.id });
      url = AppEndpointsEnum.ME + `?token=${jwt}`;
      this.logger.info(`Existing account case for auth, email=${body.email}`);
    }

    // if doesn't exists -> send URL to register
    else {
      url =
        AppEndpointsEnum.REGISTER +
        `?email=${body.email}&promo-slug=${body.promo_slug}`;
      this.logger.info(`New account case for auth, email=${body.email}`);
    }

    // send email
    await this.mailService.welcome(body.email.toLowerCase(), url);
    this.logger.info(`Successfully send login mail, email=${body.email}`);
  }

  /**
   * Register new user en return JWT.
   * @param body Request body, it should contain user infos.
   */
  public async register(body: SignUpDto): Promise<TokenDto> {
    // check that given promo exists
    const promo: PromoEntity = await this.promoRepository.findOneBySlug(
      body.promo_slug,
    );
    if (!promo) {
      this.logger.error(
        `Promo not found when register, given=${body.promo_slug}`,
      );
      throw new BadRequestException(ErrorEnum.INVALID_PROMO_SLUG);
    }

    // check if account already exists
    const account: AccountEntity = await this.accountRepository.findOneBy({
      email: body.email.toLowerCase(),
    });

    // if user not already exists
    // should save into database
    if (!account) {
      const newAccountId: string =
        await this.accountRepository.insertNewAndGetID(
          body.email.toLowerCase(),
          body.first_name,
          body.last_name,
          body.promo_slug,
        );
      const tokenDto: TokenDto = new TokenDto();
      tokenDto.token = this.appJwtService.generateToken({ sub: newAccountId });
      this.logger.info(`Successfully logged user, email=${body.email}`);

      return tokenDto;
    } else {
      this.logger.warn(
        `User already exists, cannot register again, email=${body.email}`,
      );
      return null;
    }
  }

  /**
   * Get personal infos and challenge progression about user.
   * @param headers Request headers, it should contain JWT in <code>Authorization</code>.
   */
  public async me(headers: Headers): Promise<MeDto> {
    const me: JwtInterface = this.appJwtService.getJwtFromHeaders(headers);
    const account: AccountEntity = await this.accountRepository.findOneBy({
      id: me.sub,
    });

    let challengeDto: ChallengeDto;
    if (account.instance_ip != null && account.instance_user != null) {
      // retrieve current score and user challenge to do
      challengeDto = await this.challengeService.getUserCurrentChallengeDto(
        me.sub,
      );
    }
    return new MeDto(account, process.env.SSH_PUBLIC_KEY, challengeDto);
  }
}
