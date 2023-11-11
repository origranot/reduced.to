import { IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

export class ShortenerDto {
  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsPositive()
  @IsOptional()
  ttl?: number;
}
