import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from '../../shared/enums/sort-order.enum';

export class SortUserDto {
  @IsEnum(SortOrder)
  @IsOptional()
  name: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  email: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  role: SortOrder;
}

export const SORT = 'sort';
