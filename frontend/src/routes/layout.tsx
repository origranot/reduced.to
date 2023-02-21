import { component$, Slot } from '@builder.io/qwik';
import { RequestHandler } from '@builder.io/qwik-city';
import MainLayout from '~/layouts/MainLayout';
import { isAuthorized } from '~/shared/auth.service';

export default component$(() => {
  return (
    <>
      <MainLayout>
        <Slot />
      </MainLayout>
    </>
  );
});

export const onGet: RequestHandler = async ({ cookie }) => {
  await isAuthorized(cookie);
};
