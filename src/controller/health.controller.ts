import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../service/health.service';
import { HealthDto } from '../dto/app/health.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DisabledAuth } from '../decorator/disabled-auth.decorator';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check that API is running and get version' })
  @ApiResponse({ status: 200, type: HealthDto })
  @DisabledAuth()
  public health(): Promise<HealthDto> {
    return this.healthService.health();
  }
}
