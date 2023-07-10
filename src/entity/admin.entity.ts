import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('admin')
  export class AdminEntity {
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

  }
  