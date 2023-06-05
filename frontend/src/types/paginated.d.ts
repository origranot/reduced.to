export interface PaginatedRows<T> {
  data: T[];
  total: number;
}

export interface PaginationParams {
  limit: number;
  page: number;
  filter: string;
  sort: 'asc' | 'desc';
  sortColumn: string;
}
