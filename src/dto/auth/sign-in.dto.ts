import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ErrorEnum } from '../../enum/error.enum';

export class SignInDto {
  @IsEmail({}, { message: ErrorEnum.INVALID_EMAIL })
  @ApiProperty({ example: 'john.doe@gmail.com' })
  email: string;

  @IsNotEmpty({ message: ErrorEnum.INVALID_PROMO_SLUG })
  @ApiProperty({ example: 'hetic-mt6' })
  promo_slug: string;
}

export class AdminSignInDto {
  @IsEmail({}, { message: ErrorEnum.INVALID_EMAIL })
  @ApiProperty({ example: 'admin@gmail.com' })
  email: string;
}
