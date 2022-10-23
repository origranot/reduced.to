import QRCode from 'qrcode';

// Generates the QR code for the shortened url
export function generateQRCode(width: number) {
  const result = document.querySelector('#qrcode');
  const url = document.querySelector('#result #text')!.textContent || '';

  result!.classList.remove('hidden');

  QRCode.toCanvas(document.querySelector('#qrcode canvas'), url, { width }, (error: any) => {
    if (error) console.error(error);
  });
}

// Downloads the QR code
export function downloadQRCode() {
  const canvas = document.querySelector('#qrcode canvas') as HTMLCanvasElement;
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'qrcode.png';
  a.click();
}
