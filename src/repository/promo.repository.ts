import { CustomRepository } from '../decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { PromoEntity } from '../entity/promo.entity';
import { PromoDto } from 'src/dto/bo/promo.score';

@CustomRepository(PromoEntity)
export class PromoRepository extends Repository<PromoEntity> {

  public async findAll(): Promise<PromoDto[]> {
    return await this.query(
      `
      SELECT p.name, p.slug, COUNT(a.id) AS students_count
      FROM
        promo p
      LEFT JOIN
        account a ON p.id = a.promo_id
      GROUP BY
        p.id
    `,
    );
  }

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
