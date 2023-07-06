import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { ErrorEnum } from '../../enum/error.enum';

export class SignInDto {
  @IsEmail({}, { message: ErrorEnum.INVALID_EMAIL })
  @ApiProperty({ example: 'john.doe@gmail.com' })
  email: string;
}
