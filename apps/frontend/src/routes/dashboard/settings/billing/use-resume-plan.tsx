import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { serverSideFetch } from '../../../../shared/auth.service';

export const RESUME_CONFIRMATION = 'RESUME';
export const RESUME_PLAN_MODAL_ID = 'RESUME_PLAN_MODAL';

export const useResumePlan = globalAction$(
  async (_, { fail, cookie }) => {
    const response = await serverSideFetch(`${process.env.API_DOMAIN}/api/v1/billing/plan/resume`, cookie, {
      method: 'PATCH',
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
        required_error: `Please type ${RESUME_CONFIRMATION} to confirm.`,
      })
      .refine((val) => val === RESUME_CONFIRMATION, {
        message: `Please type ${RESUME_CONFIRMATION} to confirm.`,
      }),
  })
);
