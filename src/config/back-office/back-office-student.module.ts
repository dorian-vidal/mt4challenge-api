import { BackOfficeStudentController } from '../../controller/back-office/back-office-student.controller';
import { BackOfficeStudentService } from '../../service/back-office-student.service';
import { TypeOrmExModule } from '../typeorm-ex.module';
import { AccountRepository } from '../../repository/account.repository';
import { Module } from '@nestjs/common';


@Module({
  imports: [TypeOrmExModule.forCustomRepository([AccountRepository])],
  controllers: [BackOfficeStudentController],
  providers: [BackOfficeStudentService],
})
export class BackOfficeStudentModule {}
