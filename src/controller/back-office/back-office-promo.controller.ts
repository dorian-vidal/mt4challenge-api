import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BackOfficePromoService } from 'src/service/back-office-promo.service';
import { Controller, Inject, Get, Post, Body } from '@nestjs/common';
import { PromoWithStudentsDto } from 'src/dto/bo/promo-with-students.dto';
import { PromoDto } from 'src/dto/bo/promo.dto';
import GeneralEnum from 'src/enum/general.enum';
import { Logger } from 'winston';
import { GenericResponseDto } from 'src/dto/generic-response.dto';



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
  @ApiResponse({ status: 200, type: PromoWithStudentsDto , isArray: true })
  @ApiResponse({ status: 401, description: GeneralEnum.NOT_AUTHORIZED })
  @ApiBearerAuth()
  public async findAll(): Promise<PromoWithStudentsDto[]> {
    this.logger.info('HTTP Handling findAll promo');
    return this.backOfficePromoService.findAll();
  }

  @Post('/')
    @ApiOperation({
        summary: 'Create a new promo',
    })
    @ApiResponse({ status: 200, type: GenericResponseDto })
    @ApiResponse({ status: 401, description: GeneralEnum.NOT_AUTHORIZED })
    @ApiBody({ type: PromoDto })
    @ApiBearerAuth()
    public async create(@Body() body: PromoDto): Promise<GenericResponseDto> {
        this.logger.info('HTTP Handling new promo creation');
        return this.backOfficePromoService.create(body).then(() => GenericResponseDto.ok());
    }

}
