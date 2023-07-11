import { ApiProperty } from '@nestjs/swagger';

export class PromoDto {
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    slug: string;
}
