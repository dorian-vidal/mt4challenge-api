import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorEnum } from '../../enum/error.enum';

export class SignUpDto {
  @IsEmail({}, { message: ErrorEnum.INVALID_EMAIL })
  @ApiProperty({ example: 'john.doe@gmail.com' })
  email: string;

  @IsNotEmpty({ message: ErrorEnum.INVALID_FIRST_NAME })
  @ApiProperty({ example: 'John' })
  first_name: string;

  @IsNotEmpty({ message: ErrorEnum.INVALID_LAST_NAME })
  @ApiProperty({ example: 'Doe' })
  last_name: string;
}
