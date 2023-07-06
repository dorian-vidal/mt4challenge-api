import { ApiProperty } from '@nestjs/swagger';
import { IsIP, IsNotEmpty } from 'class-validator';
import { ErrorEnum } from '../../enum/error.enum';

export class NewInstanceDto {
  @IsNotEmpty({ message: ErrorEnum.INVALID_HOST })
  @IsIP(null, { message: ErrorEnum.INVALID_HOST })
  @ApiProperty({ example: '108.177.16.0' })
  host: string;

  @IsNotEmpty({ message: ErrorEnum.INVALID_USERNAME })
  @ApiProperty({ example: 'ubuntu' })
  username: string;
}
