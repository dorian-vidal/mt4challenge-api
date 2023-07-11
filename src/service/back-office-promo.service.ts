import { Inject, Injectable } from '@nestjs/common';
import { PromoRepository } from '../repository/promo.repository';
import { Logger } from 'winston';
import { PromoWithStudentsDto } from 'src/dto/bo/promo-with-students.dto';
import { PromoDto } from 'src/dto/bo/promo.dto';
import { PromoEntity } from '../entity/promo.entity';
import { BadRequestException } from '../exception/bad-request.exception';

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
    return this.promoRepository.findAll();
  }

  /**
   * create a new promo.
   * @param body  Request body, it should contain name and slug.
   */
  public async create(body: PromoDto): Promise<void> {
    // check that promo not already exists
    const promo: PromoEntity = await this.promoRepository.findOneBy({
      slug: body.slug,
    });
    if (promo) {
      this.logger.warn(`Promo slug already exists, slug=${body.slug}`);
      throw new BadRequestException();
    }

    await this.promoRepository.createPromo(body.name, body.slug);
  }
}
