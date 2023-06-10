import { SortOrder } from '../../enums/sort-order.enum';

export const orderByBuilder = <T>(dto: Record<keyof T, SortOrder>): IOrderByResult => {
  if (!dto || !Object.keys(dto).length) {
    return undefined;
  }

  const result = Object.keys(dto).map((key) => ({ [key]: dto[key] }));

  return result;
};

export type IOrderByResult = Record<string, SortOrder>[] | undefined;
