import { IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

export class ShortenerDto {
  @IsUrl()
  originalUrl: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsPositive()
  @IsOptional()
  ttl?: number;
}
