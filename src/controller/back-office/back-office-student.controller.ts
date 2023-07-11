import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BackOfficeStudentService } from 'src/service/back-office-student.service';
import { Controller, Inject, Get, Headers } from '@nestjs/common';
import GeneralEnum from 'src/enum/general.enum';
import { Logger } from 'winston';
import { AccountWithScoreDto } from 'src/dto/bo/account-with-score.dto';


@Controller('back-office/students')
@ApiTags('students')
export class BackOfficeStudentController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly backOfficeStudentService: BackOfficeStudentService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get studensts infos such as email, first name, last name and score',
  })
  @ApiResponse({ status: 200, type: AccountWithScoreDto , isArray: true })
  @ApiResponse({ status: 401, description: GeneralEnum.NOT_AUTHORIZED })
  @ApiBearerAuth()
  public async findAll(): Promise<AccountWithScoreDto[]> {
    this.logger.info('HTTP Handling findAll students');
    return this.backOfficeStudentService.findAll();
  }
}
