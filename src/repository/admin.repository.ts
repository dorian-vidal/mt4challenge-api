import { AdminEntity } from '../entity/admin.entity';
import { CustomRepository } from '../decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';

@CustomRepository(AdminEntity)
export class AdminRepository extends Repository<AdminEntity> {}
