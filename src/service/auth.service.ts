import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../repository/account.repository';
import { SignInDto } from '../dto/auth/sign-in.dto';
import { AppJwtService } from './app-jwt.service';
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

@Injectable()
export class AuthService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly accountRepository: AccountRepository,
    private readonly appJwtService: AppJwtService,
    private readonly mailService: MailService,
    private readonly challengeService: ChallengeService,
  ) {}

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
      this.logger.info('Existing account case for auth, email=%s', body.email);
    }

    // if doesn't exists -> send URL to register
    else {
      url = AppEndpointsEnum.REGISTER + `?email=${body.email}`;
      this.logger.info('New account case for auth, email=%s', body.email);
    }

    // send email
    this.mailService.welcome(body.email.toLowerCase(), url);
    this.logger.info('Successfully send login mail, email=%s', body.email);
  }

  public async register(body: SignUpDto): Promise<TokenDto> {
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
        );
      const tokenDto: TokenDto = new TokenDto();
      tokenDto.token = this.appJwtService.generateToken({ sub: newAccountId });
      return tokenDto;
    } else {
      this.logger.warn(
        'User already exists, cannot register again, email=%s',
        body.email,
      );
      return null;
    }
  }

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
