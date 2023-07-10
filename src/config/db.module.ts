import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../entity/account.entity';
import { AchievedChallengeEntity } from '../entity/achieved-challenge.entity';
import { ChallengeEntity } from '../entity/challenge.entity';
import { PromoEntity } from '../entity/promo.entity';

export class DbModule {
  public static getTypeOrm(): DynamicModule {
    const sslConfig = {
      ssl: true,
      extra: {
        ssl: { rejectUnauthorized: false },
      },
    };

    return TypeOrmModule.forRoot({
      ...(process.env.SSL_DB === 'true' && sslConfig),
      type: 'postgres',
      url: process.env.URL_DB,
      synchronize: false,
      keepConnectionAlive: true,
      entities: [
        AccountEntity,
        AchievedChallengeEntity,
        ChallengeEntity,
        PromoEntity,
      ],
    });
  }
}
