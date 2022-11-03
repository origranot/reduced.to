import { component$, Slot } from '@builder.io/qwik';
import MainLayout from '~/layouts/MainLayout';

export default component$(() => {
  return (
    <>
      <MainLayout>
        <Slot />
      </MainLayout>
    </>
  );
});
