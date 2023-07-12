import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BackOfficeStudentService } from 'src/service/bo/back-office-student.service';
import { Controller, Get, Inject, Query } from '@nestjs/common';
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
    summary:
      'Get students infos such as email, first name, last name and score by promo slug',
  })
  @ApiResponse({ status: 200, type: AccountWithScoreDto, isArray: true })
  @ApiResponse({ status: 401, description: GeneralEnum.NOT_AUTHORIZED })
  @ApiQuery({
    name: 'promo_slug',
    type: String,
    description: 'Slug of related promo',
  })
  @ApiBearerAuth()
  public async findAll(
    @Query('promo_slug') promoSlug: string,
  ): Promise<AccountWithScoreDto[]> {
    this.logger.info(`HTTP Handling findAll students, promoSlug=${promoSlug}`);
    return this.backOfficeStudentService.findAll(promoSlug);
  }
}
