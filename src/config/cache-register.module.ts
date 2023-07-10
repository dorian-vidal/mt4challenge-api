import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { DynamicModule } from '@nestjs/common';

export class CacheRegisterModule {
  public static getConfiguration(): DynamicModule {
    return CacheModule.registerAsync({
      imports: undefined,
      useClass: undefined,
      useExisting: undefined,
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.URL_CACHE,
        }),
      }),
    });
  }
}
