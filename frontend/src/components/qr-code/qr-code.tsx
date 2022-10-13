import { component$ } from '@builder.io/qwik';
import { downloadQRCode } from './handleQRCode';

export interface QRCodeProps {
  showDownload: boolean;
}

export const QRCode = component$((props: QRCodeProps) => {
  return (
    <>
      <canvas className="mx-auto pb-2"></canvas>
      {props.showDownload && (
        <a
          href="#qrcode"
          className="text-center text-white"
          onClick$={() => downloadQRCode()}
        >
          Download QRCode
        </a>
      )}
    </>
  );
});
