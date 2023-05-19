import { ShortenerDTO } from './shortener.dto';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UserShortenerDto extends ShortenerDTO {
  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsOptional()
  expirationTime: string;
}
