import { SortOrder } from '../../enums/sort-order.enum';

export const orderByBuilder = <DTO>(
  sortDto: Record<keyof DTO, SortOrder>
): {
  orderBy: Record<string, SortOrder>[];
} => {
  if (!sortDto) {
    return;
  }
  const entries = Object.entries(sortDto);
  if (!entries.length) {
    return;
  }
  const orderByObjects = entries.map(([key, value]: [string, SortOrder]) => ({
    [key]: value,
  }));
  return { orderBy: orderByObjects };
};
