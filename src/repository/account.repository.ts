import { AccountEntity } from '../entity/account.entity';
import { CustomRepository } from '../decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';

@CustomRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  public async insertNewAndGetID(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<string> {
    const result: AccountEntity[] = await this.query(
      `
      INSERT INTO account (email, first_name, last_name)
      VALUES ($1, $2, $3)
      RETURNING id
    `,
      [email, firstName, lastName],
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
      SELECT instance_ip, instance_user
      FROM account
      WHERE id = $1
    `,
      [userId],
    );
    return result[0];
  }
}
