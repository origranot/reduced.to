import { component$ } from '@builder.io/qwik';

export const Footer = component$(() => {
  const year = new Date().getFullYear();
  return (
    <>
      <footer
        class="flex flex-col items-center justify-center w-full py-4 bg-[#3D4B66]
            dark:bg-[#ffffff]
            text-white
            dark:text-black
            text-base"
      >
        <p class="mt-8 text-center ">©{year === 2023 ? '2023' : '2023 - ' + year} Reduced.to ® All rights reserved.</p>
      </footer>
    </>
  );
});
