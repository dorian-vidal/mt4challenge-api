import { CustomRepository } from '../decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { PromoEntity } from '../entity/promo.entity';
import { PromoWithStudentsDto } from 'src/dto/bo/promo-with-students.dto';
import { PromoDto } from 'src/dto/bo/promo.dto';

@CustomRepository(PromoEntity)
export class PromoRepository extends Repository<PromoEntity> {
  public async findAll(): Promise<PromoWithStudentsDto[]> {
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

  public async createPromo(name: string, slug: string): Promise<void> {
    await this.query(
      `
      INSERT INTO promo (name, slug)
      VALUES ($1, $2)
    `,
      [name, slug],
    );
  }
}
