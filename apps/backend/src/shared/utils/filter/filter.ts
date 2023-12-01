export const filterBuilder = (fields: Record<string, any>, filter: string): IFilterResult => {
  if (!fields || !Object.keys(fields).length || !filter) {
    return undefined;
  }

  const filterResult: IFilterResult = [];

  Object.entries(fields).forEach(([key, value]) => {
    if (typeof value === 'boolean' && value) {
      filterResult.push({ [key]: { contains: filter } });
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      const nestedFilters = filterBuilder(value, filter);
      if (nestedFilters) {
        nestedFilters.forEach((nestedFilter) => {
          filterResult.push({ [key]: nestedFilter } as any);
        });
      }
    }
  });

  return filterResult.length > 0 ? filterResult : undefined;
};

export type IFilterResult = Record<string, { contains: string }>[];
