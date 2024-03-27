import { SortOrder } from '@rt/backend/shared/enums/sort-order.enum';

export const orderByBuilder = <T>(sort: Record<keyof T, SortOrder>): IOrderByResult => {
  if (!sort || !Object.keys(sort).length) {
    return undefined;
  }

  const result = Object.keys(sort).map((key) => ({ [key]: sort[key] }));

  return result;
};

export type IOrderByResult = Record<string, SortOrder>[] | undefined;
