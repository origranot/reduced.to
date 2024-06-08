import { globalAction$ } from '@builder.io/qwik-city';
import { sleep } from '@reduced.to/utils';
import { REFRESH_COOKIE_NAME, refreshTokens, setTokensAsCookies } from '../../../../shared/auth.service';

export const useRevalidatePlan = globalAction$(async (_, { fail, cookie }) => {
  for (let i = 0; i < 4; i++) {
    try {
      const refreshToken = cookie.get(REFRESH_COOKIE_NAME)?.value;
      if (!refreshToken) {
        console.error('No refresh token found in cookies');
        return fail(401, { message: 'Unauthorized' });
      }

      const { accessToken, refreshToken: newRefresh } = await refreshTokens(refreshToken);
      setTokensAsCookies(accessToken, newRefresh, cookie);

      console.debug('Tokens refreshed successfully');
    } catch (error) {
      // Do nothing
    }

    await sleep(200); // Wait before retrying
  }

  return fail(500, { message: 'Failed to refresh tokens after multiple attempts' });
});
