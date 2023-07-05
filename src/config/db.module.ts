import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../entity/account.entity';

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
      entities: [AccountEntity],
    });
  }
}
