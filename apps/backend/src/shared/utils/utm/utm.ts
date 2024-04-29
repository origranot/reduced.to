import { Prisma } from '@prisma/client';

export const createUtmObject = (utmFields: Record<string, string>) => {
  if (!utmFields || Object.keys(utmFields).length === 0) {
    return undefined;
  }

  const utm = Object.entries(utmFields).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return utm;
};

export const addUtmParams = (url: string, utm: Record<string, string> | Prisma.JsonValue) => {
  const urlObj = new URL(url);

  Object.entries(utm).forEach(([key, value]) => {
    urlObj.searchParams.append(key, value);
  });

  return urlObj.toString();
};
