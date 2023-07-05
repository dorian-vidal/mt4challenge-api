import * as mailgun from 'mailgun-js';

export class MailService {
  private readonly sender = process.env.MAILING_API_SENDER;
  private readonly mg = mailgun({
    apiKey: process.env.MAILING_API_URL,
    domain: process.env.MAILING_API_DOMAIN,
  });

  public welcome(email: string, appUrl: string): void {
    const data = {
      from: this.sender,
      to: email,
      subject: '🤩 Bienvenue sur MT4 Challenge!',
      template: 'welcome',
      'h:X-Mailgun-Variables': JSON.stringify({
        appUrl: appUrl,
      }),
    };
    this.mg.messages().send(data);
  }
}
