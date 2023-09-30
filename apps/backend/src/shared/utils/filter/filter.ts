export const filterBuilder = (fields: string[], filter: string): IFilterResult => {
  if (!fields || !fields.length) {
    return undefined;
  }

  return fields.map((field) => ({ [field]: { contains: filter } }));
};

export type IFilterResult = Record<string, { contains: string }>[] | undefined;
