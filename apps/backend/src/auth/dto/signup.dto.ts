import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Unique } from '../../shared/decorators/unique/unique.decorator';
import { ProviderType } from '@prisma/client';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsEmail()
  @Unique('user') // In which table it should be unique
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(70)
  password: string;

  @IsOptional()
  @IsString()
  provider?: ProviderType;
}
