import { IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

export class UrlDto {
  @IsUrl()
  originalUrl: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsPositive()
  @IsOptional()
  ttl?: number;
}
