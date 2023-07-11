import { Inject, Injectable } from '@nestjs/common';
import { PromoRepository } from '../repository/promo.repository';
import { Logger } from 'winston';
import { PromoWithStudentsDto } from 'src/dto/bo/promo-with-students.dto';
import { PromoDto } from 'src/dto/bo/promo.dto';

@Injectable()
export class BackOfficePromoService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly promoRepository: PromoRepository,
  ) {}

  /**
   * find all promos.
   */
  public async findAll(): Promise<PromoWithStudentsDto[]> {
    const result: PromoWithStudentsDto[] = await this.promoRepository.findAll();
    return result;
  }

  /**
   * create a new promo.
   * @param body  Request body, it should contain name and slug.
   */
  public async create(body: PromoDto): Promise<void> {
    await this.promoRepository.createPromo(body.name, body.slug);
  }
}
