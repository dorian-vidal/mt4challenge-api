import { ApiProperty } from '@nestjs/swagger';

export class ChallengeDto {
  @ApiProperty({ example: 'Créer un fichier <code>test.txt</code>' })
  description: string;

  @ApiProperty({ example: 5 })
  current_score: number;
}
