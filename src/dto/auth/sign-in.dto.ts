import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
