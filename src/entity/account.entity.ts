import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PromoEntity } from './promo.entity';

@Entity('account')
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  instance_ip: string;

  @Column({ nullable: true })
  instance_user: string;

  @ManyToOne(() => PromoEntity, (promo: PromoEntity) => promo.accounts)
  @JoinColumn({ name: 'promo_id' })
  promo: PromoEntity;
}
