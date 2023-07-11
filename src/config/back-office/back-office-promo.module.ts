import { BackOfficePromoController } from '../../controller/back-office/back-office-promo.controller';
import { BackOfficePromoService } from '../../service/back-office-promo.service';
import { TypeOrmExModule } from '../typeorm-ex.module';
import { PromoRepository } from '../../repository/promo.repository';
import { Module } from '@nestjs/common';


@Module({
  imports: [TypeOrmExModule.forCustomRepository([PromoRepository])],
  controllers: [BackOfficePromoController],
  providers: [BackOfficePromoService],
})
export class BackOfficePromoModule {}
