import { IsBoolean, IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

export class ShortenerDto {
  @IsUrl(
    { allow_fragments: true, require_protocol: false },
    {
      message: 'Url is invalid',
    }
  )
  url: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsPositive()
  expirationTime?: number;

  @IsBoolean()
  @IsOptional()
  temporary?: boolean;
}
