import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
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
}
