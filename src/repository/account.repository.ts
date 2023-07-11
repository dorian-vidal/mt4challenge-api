import { AccountEntity } from '../entity/account.entity';
import { CustomRepository } from '../decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { AccountWithScoreDto } from 'src/dto/bo/account-with-score.dto';

@CustomRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  public async findAll(promoSlug: string): Promise<AccountWithScoreDto[]> {
    return await this.query(
      `
      SELECT a.first_name, a.last_name, a.email, COALESCE(MAX(c.score), 0) AS score
      FROM account a
        INNER JOIN promo p ON p.id = a.promo_id
        LEFT JOIN achieved_challenge ac ON a.id = ac.account_id
        LEFT JOIN challenge c ON ac.challenge_id = c.id
      WHERE p.slug = $1
      GROUP BY a.id
      ORDER BY score DESC
      `,
      [promoSlug],
    );
  }

  public async insertNewAndGetID(
    email: string,
    firstName: string,
    lastName: string,
    promoId: string,
  ): Promise<string> {
    const result: AccountEntity[] = await this.query(
      `
      INSERT INTO account (email, first_name, last_name, promo_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
      [email, firstName, lastName, promoId],
    );
    return result[0].id;
  }

  public async updateInstance(
    userId: string,
    instanceIp: string,
    instanceUser: string,
  ): Promise<void> {
    await this.query(
      `
      UPDATE account SET
        instance_ip = $2,
        instance_user = $3
      WHERE id = $1
    `,
      [userId, instanceIp, instanceUser],
    );
  }

  public async getInstanceInfosById(userId: string): Promise<AccountEntity> {
    const result: AccountEntity[] = await this.query(
      `
      SELECT id, instance_ip, instance_user
      FROM account
      WHERE id = $1
    `,
      [userId],
    );
    return result[0];
  }
}
