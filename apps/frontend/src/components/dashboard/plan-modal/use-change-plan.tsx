import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { setTokensAsCookies } from '../../../shared/auth.service';

export const useChangePlan = globalAction$(
  async ({ planId, itemId, operationType }, { fail, cookie }) => {
    const response: Response = await fetch(`${process.env.API_DOMAIN}/api/v1/billing/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`,
      },
      body: JSON.stringify({ planId, itemId, operationType }),
    });

    const data = await response.json();

    if (response.status !== 201 && response.status !== 200) {
      return fail(500, {
        message: data?.message,
      });
    }

    const { accessToken, refreshToken } = data;
    if (accessToken && refreshToken) {
      setTokensAsCookies(accessToken, refreshToken, cookie);
    }
    return data;
  },
  zod$({
    planId: z.string().min(5),
    itemId: z.string().min(5),
    operationType: z.string(),
  })
);
