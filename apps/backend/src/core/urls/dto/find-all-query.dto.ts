import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Sortable } from '../../../shared/decorators';
import { SortOrder } from '../../../shared/enums/sort-order.enum';
import { PaginationQueryDto } from '../../../shared/utils/pagination';

export class FindAllQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  @MaxLength(30)
  filter?: string;

  @Sortable(['expirationTime', 'createdAt'])
  sort?: Record<string, SortOrder>;
}
