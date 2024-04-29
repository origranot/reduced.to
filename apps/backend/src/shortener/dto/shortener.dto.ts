import { IsBoolean, IsOptional, IsPositive, IsString, IsUrl, MaxLength } from 'class-validator';

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

  @IsOptional()
  @IsString()
  password?: string;

  // UTM parameters
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utm_ref?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  utm_source?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  utm_medium?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  utm_campaign?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  utm_term?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  utm_content?: string;

  @IsBoolean()
  @IsOptional()
  temporary?: boolean;
}
