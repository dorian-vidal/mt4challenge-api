import { ApiProperty } from '@nestjs/swagger';
import { PromoDto } from './promo.dto';

export class PromoWithStudentsDto extends PromoDto {
  @ApiProperty()
  students_count: number;
}
