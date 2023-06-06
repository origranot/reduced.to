import { SortOrder } from '../../enums/sort-order.enum';

export const orderByBuilder = <DTO>(sortDto: Record<keyof DTO, SortOrder>): Record<string, SortOrder>[] => {
  if (!sortDto) {
    return [];
  }
  const entries = Object.entries(sortDto);
  return entries.map(([key, value]: [string, SortOrder]) => ({
    [key]: value,
  }));
};
