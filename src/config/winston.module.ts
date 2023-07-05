import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

/**
 * Get default Winston logging config.
 * @param appName App name used to create logging files.
 */
export const defaultWinstonConfig = (appName: string) => {
  const logFormat = winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
  );

  return WinstonModule.forRoot({
    transports: [
      new winston.transports.Console({
        format: logFormat,
        level: 'debug',
      }),
      new winston.transports.File({
        format: logFormat,
        dirname: '.logs',
        filename: `${appName}_error.log`,
        level: 'error',
      }),
      new winston.transports.File({
        format: logFormat,
        dirname: '.logs',
        filename: `${appName}_combined.log`,
        level: 'debug',
      }),
    ],
  });
};
