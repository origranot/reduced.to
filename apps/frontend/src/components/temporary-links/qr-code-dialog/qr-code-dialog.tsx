import { component$, $, useVisibleTask$ } from '@builder.io/qwik';
import QRCode from 'qrcode';
import { HiArrowDownTrayOutline } from '@qwikest/icons/heroicons';

export const QR_CODE_DIALOG_ID = 'QR_MODAL';

export interface QrCodeDialogProps {
  link: {
    key: string;
  };
}

export const QrCodeDialog = component$((props: QrCodeDialogProps) => {
  const { link } = props;

  const generateQRCode = $((url: string) => {
    QRCode.toCanvas(document.querySelector(`#${QR_CODE_DIALOG_ID} canvas`), url, { width: 256, margin: 2 }, (error: any) => {
      if (error) console.error(error);
    });
  });

  useVisibleTask$(({ track }) => {
    track(() => link);
    const url = `${process.env.DOMAIN}/${link?.key}`;
    generateQRCode(url);
  });

  const downloadQRCodeImage = $(() => {
    // Get the canvas element
    const canvas = document.querySelector<HTMLCanvasElement>(`#${QR_CODE_DIALOG_ID} canvas`);
    if (!canvas) {
      return;
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = img.src;
    link.download = `${props.link?.key}.png`;
    link.click();
  });

  return (
    <dialog id={QR_CODE_DIALOG_ID} class="modal">
      <div class="modal-box">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">QR Code</h1>
        <p class="text-gray-600 dark:text-gray-400">Scan the QR Code to open the link on your phone.</p>
        <div class="p-5">
          <canvas class="mx-auto"></canvas>
        </div>
        {/* Link to download the QR code */}
        <div class="tooltip" data-tip="Download">
          <button class="btn btn-ghost" onClick$={downloadQRCodeImage}>
            <HiArrowDownTrayOutline class="h-5 w-5" />
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});
