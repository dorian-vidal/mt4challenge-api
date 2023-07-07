import { Module } from '@nestjs/common';
import { InitModule } from './init.module';
import { DbModule } from './db.module';
import { defaultWinstonConfig } from './winston.module';
import { BackOfficeController } from 'src/controller/back-office.controller';

@Module({
  imports: [
    InitModule,
    DbModule.getTypeOrm(),
    defaultWinstonConfig('back-office')
  ],
  controllers: [BackOfficeController],
  providers: [],
})
export class BackOfficeModule {}
