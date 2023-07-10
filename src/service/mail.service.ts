import * as mailgun from 'mailgun-js';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { BadRequestException } from '../exception/bad-request.exception';

export class MailService {
  private readonly sender: string = process.env.MAILING_API_SENDER;
  private readonly mg = mailgun({
    apiKey: process.env.MAILING_API_URL,
    domain: process.env.MAILING_API_DOMAIN,
  });

  constructor(@Inject('winston') private readonly logger: Logger) {}

  public async welcome(email: string, appUrl: string): Promise<void> {
    const data = {
      from: this.sender,
      to: email,
      subject: '🤩 Bienvenue sur MT4 Challenge!',
      template: 'welcome',
      'h:X-Mailgun-Variables': JSON.stringify({
        appUrl: appUrl,
      }),
    };
    try {
      await this.mg.messages().send(data);
    } catch (error: any) {
      this.logger.error(`Error happens while sending email, error=${error}`);
      throw new BadRequestException();
    }
  }
}
