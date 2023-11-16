import { IsBoolean, IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

export class ShortenerDto {
  @IsUrl(
    { allow_fragments: true, require_protocol: false },
    {
      message: 'Url is invalid, please make sure it is a valid url',
    }
  )
  url: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsPositive()
  @IsOptional()
  ttl?: number;

  @IsBoolean()
  @IsOptional()
  temporary?: boolean;
}
