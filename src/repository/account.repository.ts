import { AccountEntity } from '../entity/account.entity';
import { CustomRepository } from '../decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';

@CustomRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {}
