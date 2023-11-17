import { component$ } from '@builder.io/qwik';

export const LINK_MODAL_ID = 'link-modal';

export const LinkModal = component$(() => {
  return (
    <>
      <dialog id={LINK_MODAL_ID} class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Hello!</h3>
          <p class="py-4">Press ESC key or click the button below to close</p>
          <div class="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
});
