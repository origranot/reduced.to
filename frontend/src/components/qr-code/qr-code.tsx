import { component$ } from '@builder.io/qwik';
import { downloadQRCode } from './handleQRCode';

export interface QRCodeProps {
  showDownload: boolean;
}

export const QRCode = component$((props: QRCodeProps) => {
  return (
    <>
      <canvas className="mx-auto mb-2 rounded-lg shadow-lg"></canvas>
      {props.showDownload && (
        <a
          href="#qrcode"
          className="btn btn-primary text-center"
          onClick$={() => downloadQRCode()}
        >
         Download Code
        </a>
      )}
    </>
  );
});
