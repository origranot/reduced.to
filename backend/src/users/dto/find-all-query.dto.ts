import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class FindAllQueryDto {
  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @Min(1)
  @IsInt()
  @Max(100)
  @IsDefined()
  @Type(() => Number)
  limit: number;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  filter?: string;
}
