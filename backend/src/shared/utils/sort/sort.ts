import { SortOrder } from '../../enums/sort-order.enum';

export const orderByBuilder = <DTO>(sortDto: Record<keyof DTO, SortOrder>): Record<string, SortOrder>[] => {
  const entries = Object.entries(sortDto);
  return entries.map(([key, value]: [string, SortOrder]) => ({
    [key]: value,
  }));
};
