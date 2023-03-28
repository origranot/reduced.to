import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { downloadQRCode } from './handleQRCode';

export interface QRCodeProps {
  showDownload: boolean;
}

export const QRCode = component$((props: QRCodeProps) => {
  return (
    <>
      <canvas class="mx-auto mb-2 rounded-lg shadow-lg"></canvas>
      {props.showDownload && (
        <Link href="#qrcode" class="text-center" onClick$={() => downloadQRCode()}>
          Download QRCode
        </Link>
      )}
    </>
  );
});
