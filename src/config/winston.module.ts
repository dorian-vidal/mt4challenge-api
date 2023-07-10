import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { DynamicModule } from '@nestjs/common';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

/**
 * Get default Winston logging config.
 */
export const defaultWinstonConfig = (): DynamicModule => {
  return WinstonModule.forRoot({
    transports: [
      new winston.transports.Console({ level: 'debug' }),
      new LogtailTransport(new Logtail(process.env.LOGTAIL_SOURCE_TOKEN)),
    ],
  });
};
