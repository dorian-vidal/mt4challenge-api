import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('challenge')
export class ChallengeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column()
  description: string;

  @Column()
  score: number;

  @Column()
  ssh_command_verify: string;

  @Column()
  ssh_command_expected_result: string;

  @Column()
  ssh_command_expected_result_dynamic: boolean;
}
