import { component$, Slot } from '@builder.io/qwik';
import NotFoundLayout from '../../layouts/NotFoundLayout';
import { Footer } from '../../components/footer/footer';

export default component$(() => {
  return (
    <NotFoundLayout>
      <Slot />
      <Footer />
    </NotFoundLayout>
  );
});
