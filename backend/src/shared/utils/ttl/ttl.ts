export const calculateDateFromTtl = (ttl: number): Date => {
  return new Date(new Date().getTime() + ttl);
};
