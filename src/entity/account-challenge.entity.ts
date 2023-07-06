import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';
import { ChallengeEntity } from './challenge.entity';

@Entity('achieved_challenge')
export class AchievedChallengeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @JoinColumn({ name: 'account_id' })
  @ManyToOne(() => AccountEntity, (account: AccountEntity) => account.id, {
    eager: true,
    cascade: true,
  })
  account: AccountEntity;

  @JoinColumn({ name: 'challenge_id' })
  @ManyToOne(
    () => ChallengeEntity,
    (challenge: ChallengeEntity) => challenge.id,
    {
      eager: true,
      cascade: true,
    },
  )
  challenge: ChallengeEntity;
}
