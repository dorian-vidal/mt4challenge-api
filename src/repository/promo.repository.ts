import { CustomRepository } from '../decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { PromoEntity } from '../entity/promo.entity';

@CustomRepository(PromoEntity)
export class PromoRepository extends Repository<PromoEntity> {
  public async findOneBySlug(slug: string): Promise<PromoEntity> {
    const result = await this.query(
      `
      SELECT id FROM promo WHERE slug = $1
    `,
      [slug],
    );
    return result[0];
  }
}
