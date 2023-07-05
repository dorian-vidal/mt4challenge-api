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

  public async me(headers: Headers): Promise<MeDto> {
    const me: JwtInterface = this.appJwtService.getJwtFromHeaders(headers);
    const account: AccountEntity = await this.accountRepo.findOneBy({
      id: me.sub,
    });
    return new MeDto(account);
  }
}
