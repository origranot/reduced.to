import type { MockResponse } from './types';

const mockAccessToken =
  'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRmZWJkMDRmLWZiNjEtNDg4OC05YTM1LThjZWZhN2FhMjlkOSIsImVtYWlsIjoiYUBnLmNvbSIsIm5hbWUiOiJhYWFhYSIsInJvbGUiOiJVU0VSIiwidmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJyZWR1Y2VkLnRvIiwiaWF0IjoxNjg4NDAzMjI2LCJleHAiOjE2ODg0MDM1MjZ9.rNjYIx-MzndAys-DU15dQm751fljXL-ABbb3U_F03M8; Domain=localhost; Expires=Mon, 03 Jul 2023 16:58:46 GMT; HttpOnly; Path=/; SameSite=Strict';
const mockRefreshToken =
  'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRmZWJkMDRmLWZiNjEtNDg4OC05YTM1LThjZWZhN2FhMjlkOSIsImVtYWlsIjoiYUBnLmNvbSIsIm5hbWUiOiJhYWFhYSIsInJvbGUiOiJVU0VSIiwidmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJyZWR1Y2VkLnRvIiwiaWF0IjoxNjg4NDAzMjI2LCJleHAiOjE2ODkwMDgwMjZ9.ehG0yhzrO9Em8CeaW2tyqGmk2Uspv1CVX1GLxerhvoQ; Domain=localhost; Expires=Mon, 10 Jul 2023 16:53:46 GMT; HttpOnly; Path=/; SameSite=Strict';

export const mockResponses: MockResponse = {
  SHORTEN_URL: {
    status: 201,
    contentType: 'application/json',
    body: JSON.stringify({ newUrl: 'mhqid' }),
  },
  REGISTER: {
    status: 200,
    headers: {
      'set-cookie': [mockAccessToken, mockRefreshToken],
    },
  },
};
