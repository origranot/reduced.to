import { SortOrder, serializeQueryUserPaginationParams } from '../components/dashboard/table/table-server-pagination';
import { authorizedFetch } from '../shared/auth.service';

export interface PaginationParams {
  url: string;
  page: number;
  limit: number;
  filter?: string;
  minCreatedAt?: string;
  maxCreatedAt?: string;
  minExpirationTime?: string;
  maxExpirationTime?: string;
  sort: Record<string, SortOrder>;
}

export interface PaginationResult {
  data: any[];
  total: number;
}

export const fetchWithPagination = async ({
  url,
  page,
  limit,
  sort,
  filter,
  maxCreatedAt,
  minCreatedAt,
  minExpirationTime,
  maxExpirationTime,
}: PaginationParams) => {
  const queryParams = serializeQueryUserPaginationParams({
    page,
    limit,
    sort,
    filter,
    maxCreatedAt,
    minCreatedAt,
    minExpirationTime,
    maxExpirationTime,
  });
  const response = await authorizedFetch(`${url}?${queryParams}`);
  const data = (await response.json()) as PaginationResult;
  if (!data || !data.data) {
    console.warn('Server response is not valid', response);

    data.total = 0;
    data.data = [];
  }

  return data;
};
