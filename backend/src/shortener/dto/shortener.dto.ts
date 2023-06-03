import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class ShortenerDto {
  @IsUrl()
  originalUrl: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  ttl?: number;
}
