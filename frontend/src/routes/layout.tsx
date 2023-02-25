import { component$, Slot } from '@builder.io/qwik';
import { loader$, RequestHandler } from '@builder.io/qwik-city';
import MainLayout from '~/layouts/MainLayout';
import { isAuthorized } from '~/shared/auth.service';
import jwt_decode from 'jwt-decode';

interface UserCtx {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  validated: boolean;
}

export const useGetCurrentUser = loader$<UserCtx | null>(({ cookie }) => {
  const token = cookie.get('accessToken');
  if (!token) return null;

  return jwt_decode(token.value);
});

export const onGet: RequestHandler = async ({ cookie }) => {
  await isAuthorized(cookie);
};

export default component$(() => {
  return (
    <>
      <MainLayout>
        <Slot />
      </MainLayout>
    </>
  );
});
