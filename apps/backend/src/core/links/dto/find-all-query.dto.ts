import { IsDefined, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Sortable } from '@rt/backend/shared/decorators';
import { SortOrder } from '@rt/backend/shared/enums/sort-order.enum';
import { Type } from 'class-transformer';

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

  @Sortable(['expirationTime', 'createdAt'])
  sort?: Record<string, SortOrder>;
}
