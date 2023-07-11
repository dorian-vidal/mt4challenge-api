import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../repository/account.repository';
import { Logger } from 'winston';
import { AccountWithScoreDto } from 'src/dto/bo/account-with-score.dto';

@Injectable()
export class BackOfficeStudentService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly accountRepository: AccountRepository,
  ) {}

  /**
   * find all students.
   */
  public async findAll(): Promise<AccountWithScoreDto[]> {
    const result: AccountWithScoreDto[] =
      await this.accountRepository.findAll();
    return result;
  }
}
