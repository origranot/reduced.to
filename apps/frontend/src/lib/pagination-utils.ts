import { authorizedFetch } from "../shared/auth.service";

export interface PaginationParams {
  url: string;
  page: number;
  limit: number;
}

export interface PaginationResult {
  data: any[];
  total: number;
}

export const fetchWithPagination = async ({ url, page, limit }: PaginationParams) => {
  const query = new URLSearchParams({ limit: limit.toString(), page: page.toString() });
  const response = await authorizedFetch(`${url}?${query}`);
  const data = await response.json();
  return data.data;
};
