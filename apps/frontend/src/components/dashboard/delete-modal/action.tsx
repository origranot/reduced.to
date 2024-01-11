import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ACCESS_COOKIE_NAME } from '../../../shared/auth.service';
import { DELETE_CONFIRMATION } from './delete-modal';

export const useDeleteLink = globalAction$(
  async ({ idToDelete }, { fail, cookie }) => {
    const response: Response = await fetch(`${process.env.API_DOMAIN}/api/v1/links/${idToDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.get(ACCESS_COOKIE_NAME)?.value}`,
      },
    });

    const data = await response.json();

    if (response.status !== 200) {
      return fail(data?.statusCode || 500, {
        message: data?.message,
      });
    }
  },
  zod$({
    idToDelete: z.string(),
    confirmation: z
      .string({
        required_error: `Please type ${DELETE_CONFIRMATION} to confirm.`,
      })
      .refine((val) => val === DELETE_CONFIRMATION, {
        message: `Please type ${DELETE_CONFIRMATION} to confirm.`,
      }),
  })
);
