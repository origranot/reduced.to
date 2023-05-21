import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class ShortenerDto {
  @IsUrl()
  originalUrl: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  expirationTime?: string;
}
