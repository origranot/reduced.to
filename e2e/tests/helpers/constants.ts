type TRoutesKeys = 'SHORTEN_URL' | 'REGISTER' | 'LOGIN';

export const routes: Record<TRoutesKeys, string> = {
  SHORTEN_URL: '**/api/v1/shortener',
  REGISTER: '**/q-data.json?qaction=ddG3icClWRY',
  LOGIN: '**/q-data.json?qaction=5BCOSibCc1A',
};
