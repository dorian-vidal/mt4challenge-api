import { ApiProperty } from '@nestjs/swagger';

export class PromoWithStudentsDto {
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    slug: string;
      
    @ApiProperty()
    students_count: number;
}
