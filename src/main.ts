import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as express from 'express';
import * as http from 'http';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './guard/auth.guard';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { JWTUtil } from './util/jwt.util';
import { AppJwtService } from './service/jwt/app-jwt.service';
import { BackOfficeJwtService } from './service/jwt/back-office-jwt.service';
import { AppModule } from './config/app.module';
import { BackOfficeModule } from './config/back-office/back-office.module';
import * as fs from 'fs';
import { ChallengeDisabledGuard } from './guard/challenge-disabled.guard';
import { CacheService } from './service/cache.service';

const createApp = async (
  server: any,
  module: any,
  jwtService: JWTUtil,
): Promise<NestExpressApplication> => {
  const app = await NestFactory.create<NestExpressApplication>(
    module,
    new ExpressAdapter(server),
  );

  // auth and validation
  app.useGlobalGuards(new AuthGuard(app.get(Reflector), jwtService));

  // global stuff
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // cors and security
  app.use(helmet());
  app.enableCors({
    origin: [process.env.ALLOW_ORIGIN, process.env.BACKOFFICE_ALLOW_ORIGIN],
    methods: ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Authorization',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  });
  return app;
};

async function bootstrap() {
  const server = express();
  const app = await createApp(server, AppModule, new AppJwtService());
  app.useGlobalGuards(
    new ChallengeDisabledGuard(
      app.get<Reflector>(Reflector),
      app.get<CacheService>(CacheService),
    ),
  );

  const backOffice = await createApp(
    server,
    BackOfficeModule,
    new BackOfficeJwtService(),
  );

  // swagger
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const options = new DocumentBuilder()
    .setTitle('MT4 - Challenge (team #2)')
    .setDescription('The MT4 Challenge API description.')
    .setVersion(packageJson.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const backOfficeDocument = SwaggerModule.createDocument(backOffice, options);
  SwaggerModule.setup('swagger/app', app, document);
  SwaggerModule.setup('swagger/back-office', backOffice, backOfficeDocument);

  await Promise.all([app.init(), backOffice.init()]);
  http.createServer(server).listen(process.env.PORT || 5000);
}

bootstrap().then(() => console.log('App running!'));
