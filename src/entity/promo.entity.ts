import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('promo')
export class PromoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column()
  name: string;

  @Column()
  slug: string;

  @OneToMany(() => AccountEntity, (account: AccountEntity) => account.promo, {
    eager: true,
    cascade: true,
  })
  accounts: AccountEntity[];
}
