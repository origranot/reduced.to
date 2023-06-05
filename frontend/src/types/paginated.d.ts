export interface PaginatedRows<T> {
  data: T[];
  total: number;
}

export enum SortOrder {
  DESC = 'desc',
  ASC = 'asc',
}

export interface PaginationParams {
  limit: number;
  page: number;
  filter: string;
  sort: SortOrder;
  sortColumn: string;
}
