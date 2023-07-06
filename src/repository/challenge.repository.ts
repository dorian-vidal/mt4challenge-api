import { CustomRepository } from '../decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { ChallengeEntity } from '../entity/challenge.entity';

@CustomRepository(ChallengeEntity)
export class ChallengeRepository extends Repository<ChallengeEntity> {
  public async getUserCurrentChallenge(
    userId: string,
  ): Promise<ChallengeEntity> {
    const result = await this.query(
      `
      SELECT description FROM achieved_challenge ac
        LEFT JOIN challenge c ON c.id = ac.challenge_id
      WHERE ac.account_id = $1
      ORDER BY score DESC
      FETCH FIRST ROW ONLY
    `,
      [userId],
    );
    return result[0];
  }

  public async getUserLastAchievedChallenge(
    userId: string,
  ): Promise<ChallengeEntity> {
    const result = await this.query(
      `
      SELECT score FROM achieved_challenge ac
        LEFT JOIN challenge c ON c.id = ac.challenge_id
      WHERE ac.account_id = $1
      ORDER BY score DESC
      LIMIT 1 OFFSET 1
    `,
      [userId],
    );
    return result[0];
  }

  public async getFirstChallenge(): Promise<ChallengeEntity> {
    const result = await this.query(`
      SELECT description FROM challenge
      ORDER BY score
      FETCH FIRST ROW ONLY
    `);
    return result[0];
  }
}
