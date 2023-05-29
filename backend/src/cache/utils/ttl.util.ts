export const convertExpirationTimeToTtl = (expirationTime: Date): number => {
  if (!expirationTime) {
    return null;
  }
  const expirationTimeAsNumber = expirationTime.getTime();
  const now = new Date().getTime();
  if (expirationTimeAsNumber < now) {
    return null;
  }
  return (expirationTimeAsNumber - now) / 1000;
};
