import { component$, Slot } from '@builder.io/qwik';
import NotFoundLayout from '~/layouts/NotFoundLayout';

export default component$(() => {
  return (
    <NotFoundLayout>
      <Slot />
    </NotFoundLayout>
  );
});
