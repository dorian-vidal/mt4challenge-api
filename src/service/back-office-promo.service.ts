import { Inject, Injectable } from '@nestjs/common';
import { PromoRepository } from '../repository/promo.repository';
import { Logger } from 'winston';
import { PromoDto } from 'src/dto/bo/promo.score';

@Injectable()
export class BackOfficePromoService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly promoRepository: PromoRepository,
  ) {}

  /**
   * find all promos.
   */
    public async findAll(): Promise<PromoDto[]> {
    const result: PromoDto[] = await this.promoRepository.findAll();
    return result;
    }

}
