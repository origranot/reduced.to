import { IsDefined, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Sortable } from '../../../shared/decorators';
import { SortOrder } from '../../../shared/enums/sort-order.enum';
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

  @IsString()
  @IsOptional()
  @MaxLength(30)
  minCreatedAt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  maxCreatedAt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  minExpirationTime?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  maxExpirationTime?: string;

  @Sortable(['expirationTime', 'createdAt'])
  sort?: Record<string, SortOrder>;
}
