import { ApiProperty } from '@nestjs/swagger';

export class PromoDto {
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    slug: string;
      
    @ApiProperty()
    students_count: number;
}
