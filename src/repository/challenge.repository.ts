import { CustomRepository } from '../decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { ChallengeEntity } from '../entity/challenge.entity';

@CustomRepository(ChallengeEntity)
export class ChallengeRepository extends Repository<ChallengeEntity> {
  public async getUserCurrentScore(userId: string): Promise<number | null> {
    const result: ChallengeEntity[] = await this.query(
      `
      SELECT score
      FROM achieved_challenge ac
        LEFT JOIN challenge c ON c.id = ac.challenge_id
      WHERE ac.account_id = $1
      ORDER BY score DESC
      FETCH FIRST ROW ONLY
    `,
      [userId],
    );
    return result && result.length > 0 ? result[0].score : null;
  }

  public async getChallengeAfter(
    challengeScore: number,
  ): Promise<ChallengeEntity> {
    const result: ChallengeEntity[] = await this.query(
      `
      SELECT
        description, score, ssh_command_verify, ssh_command_expected_result, ssh_command_expected_result_dynamic
      FROM challenge
      WHERE score > $1
      ORDER BY score
      FETCH FIRST ROW ONLY
    `,
      [challengeScore],
    );
    return result[0];
  }

  public async getFirstChallenge(): Promise<ChallengeEntity> {
    const result: ChallengeEntity[] = await this.query(`
      SELECT
        description, score, ssh_command_verify, ssh_command_expected_result, ssh_command_expected_result_dynamic
      FROM challenge
      ORDER BY score
      FETCH FIRST ROW ONLY
    `);
    return result[0];
  }

  public async findAll(): Promise<ChallengeEntity[]> {
    return this.query(`
      SELECT    
        id, description, score, ssh_command_verify, ssh_command_expected_result, ssh_command_expected_result_dynamic
      FROM challenge
      ORDER BY score
    `);
  }

  public async deleteAllAchievedChallengeForUser(
    userId: string,
  ): Promise<void> {
    return this.query(
      `
      DELETE FROM achieved_challenge
      WHERE account_id = $1
    `,
      [userId],
    );
  }

  public async saveAchievedChallenge(
    userId: string,
    challengeId: string,
  ): Promise<void> {
    await this.query(
      `
      INSERT INTO achieved_challenge(account_id, challenge_id)
      VALUES ($1, $2)
    `,
      [userId, challengeId],
    );
  }
}
