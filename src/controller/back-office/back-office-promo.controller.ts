import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BackOfficePromoService } from 'src/service/back-office-promo.service';
import { Controller, Inject, Get } from '@nestjs/common';
import { PromoDto } from 'src/dto/bo/promo.score';
import GeneralEnum from 'src/enum/general.enum';
import { Logger } from 'winston';



@Controller('back-office/promo')
@ApiTags('promo')
export class BackOfficePromoController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly backOfficePromoService: BackOfficePromoService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get promo infos such as name, first slug, and students',
  })
  @ApiResponse({ status: 200, type: PromoDto , isArray: true })
  @ApiResponse({ status: 401, description: GeneralEnum.NOT_AUTHORIZED })
  @ApiBearerAuth()
  public async findAll(): Promise<PromoDto[]> {
    this.logger.info('HTTP Handling findAll promo');
    return this.backOfficePromoService.findAll();
  }
}
