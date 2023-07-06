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

@Injectable()
export class AuthService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly accountRepo: AccountRepository,
    private readonly appJwtService: AppJwtService,
    private readonly mailService: MailService,
  ) {}

  public async login(body: SignInDto): Promise<void> {
    // check if account already exists
    const account: AccountEntity = await this.accountRepo.findOneBy({
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
    const account: AccountEntity = await this.accountRepo.findOneBy({
      email: body.email.toLowerCase(),
    });

    // if user not already exists
    // should save into database
    if (!account) {
      const newAccountId = await this.accountRepo.insertNewAndGetID(
        body.email.toLowerCase(),
        body.first_name,
        body.last_name,
      );
      const tokenDto = new TokenDto();
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
    const account: AccountEntity = await this.accountRepo.findOneBy({
      id: me.sub,
    });
    // FIXME: retrieve last score and user current challenge
    return new MeDto(account);
  }
}
