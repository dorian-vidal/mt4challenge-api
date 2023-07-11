import { ApiProperty } from '@nestjs/swagger';

export class AccountWithScoreDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  score: number;
}
