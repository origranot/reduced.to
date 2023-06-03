export const calculateSkip = (page: number, limit: number): number => {
  if (page < 1) {
    return 0;
  }

  const skip = (page - 1) * limit;
  return skip;
};
