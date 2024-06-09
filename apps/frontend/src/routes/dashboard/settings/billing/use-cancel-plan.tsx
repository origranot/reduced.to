import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { serverSideFetch } from '../../../../shared/auth.service';
const CANCEL_CONFIRMATION = 'CANCEL';
export const CANCEL_PLAN_MODAL_ID = 'CANCEL_PLAN_MODAL';

export const useCancelPlan = globalAction$(
  async (_, { fail, cookie }) => {
    const response = await serverSideFetch(`${process.env.API_DOMAIN}/api/v1/billing/plan`, cookie, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.status !== 200) {
      return fail(500, {
        message: data?.message,
      });
    }
  },
  zod$({
    confirmation: z
      .string({
        required_error: `Please type ${CANCEL_CONFIRMATION} to confirm.`,
      })
      .refine((val) => val === CANCEL_CONFIRMATION, {
        message: `Please type ${CANCEL_CONFIRMATION} to confirm.`,
      }),
  })
);
