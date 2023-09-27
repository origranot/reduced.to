export const calculateSkip = (page: number, limit: number): number => {
  if (page < 1) {
    return 0;
  }

  const skip = (page - 1) * limit;
  return skip;
};

export interface IPaginationResult<T> {
  data: Partial<T>[];
  total: number;
}

export interface IPaginationOptions {
  limit: number;
  skip?: number;
}
