import { $, component$, useStylesScoped$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import animations from '../assets/css/animations.css?inline';
import loader from '../assets/css/loader.css?inline';
import styles from './index.css?inline';
import confetti from "canvas-confetti"
import QRCode from "qrcode"

export default component$(() => {
  useStylesScoped$(animations)
  useStylesScoped$(styles)
  useStylesScoped$(loader)

  // Generates the QR code for the shortened url
  const generateQRCode$ =  $(() => {
    const result = document.querySelector("#qrcode")
    const url = document.querySelector("#result #text")!.textContent || ""

    result!.classList.replace('d-none', 'd-flex')

    QRCode.toCanvas(document.querySelector("#qrcode canvas"), url, function (error) {
      if (error) console.error(error)
      console.log('success!');
    })
  })

  // Downloads the QR code
  const downloadQRCode$ = $(() => {
    const canvas = document.querySelector("#qrcode canvas") as HTMLCanvasElement
    const a = document.createElement("a")
    a.href = canvas.toDataURL("image/png")
    a.download = "qrcode.png"
    a.click()
  })

  // Open link in a new window/tab.
  const openLink$ = $(() => {
    const text = document.querySelector('#result #text')!.textContent;
    window.open(text!, '_blank');
  });

  const toastAlert$ = $(async (timeoutInMiliseconds: number = 2000) => {
    const urlAlert = document.getElementById("urlAlert");

    urlAlert!.classList.add('fade-in');
    urlAlert!.classList.remove('collapse');

    setTimeout(() => {
      urlAlert!.classList.remove('fade-in');
      urlAlert!.classList.add('fade-out');

      setTimeout(() => {
        urlAlert!.classList.add('collapse');
        urlAlert!.classList.remove('fade-out');
      }, 500);
    }, timeoutInMiliseconds);
  })

  /**
   * Copy link to clipboard.
   */
   const confettiAnimate$ = $(() => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin:{
        x: 0,
        y:.8
      }
      });
    confetti({
      particleCount: 120,
      spread: 100,
      origin:{
        x: 1,
        y:.8
      }
      });
  })

  const copyUrl$ = $(() => {
    const result = document.querySelector("#result #text");
    navigator.clipboard.writeText(result!.textContent!);
    toastAlert$();
  });

  /**
   * Returns the shorter link from the server.
   * @param {String} originalUrl - The original url we want to shorten.
   */
  const getShortenUrl$ = $(async (originalUrl: string) => {
    let result;
    try {
      result = await fetch('/api/v1/shortener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl })
      });
    } catch (err) {
      return null;
    }
    return result.json();
  });

  const handleShortenerClick$ = $(async () => {
    const result = document.getElementById("result");
    const loader = document.getElementById("loading");
    const urlInput = document.getElementById("urlInput") as HTMLInputElement;
    const qrCodeResult = document.querySelector("#qrcode")

    // Remove the QRCode Result Div from the screen
    qrCodeResult!.classList.replace('d-flex', 'd-none')

    loader!.style.display = "block";
    result!.style.display = "none";

    const { newUrl } = await getShortenUrl$(urlInput!.value);

    // Remove the loader from the screen
    loader!.style.display = "none";
    result!.style.display = "block";

    urlInput.value = '';

    if (!newUrl) {
      result!.querySelector('#error')!.textContent = 'This url is invalid..';
      result!.querySelector('#text')!.textContent = '';
      result!.querySelector('#action')!.classList.replace('d-block', 'd-none');
      return;
    }

    result!.querySelector('#error')!.textContent = '';
    result!.querySelector('#text')!.textContent = window.location.href + newUrl;
    result!.querySelector('#action')!.classList.replace('d-none', 'd-block');

    copyUrl$()
    confettiAnimate$();
  });

  const handleShortenerKeypress$ = $((e: KeyboardEvent) => {
    if (e.key === 'enter') {
      handleShortenerClick$();
    }
  });

  return (
    <>
      <div class="container">
        <div className="d-flex flex-row-reverse my-5">
          <a href="https://github.com/origranot/url-shortener" className="github-button" data-size="large" data-show-count="true" aria-label="Star origranot/url-shortener on Github"> Star</a>
        </div>
      </div>
      <div class="container">
        <h1 class="p-3 text-light font-weight-bold">
          URL Shortener
        </h1>
        <div class="alert alert-primary" role="alert">
          Add your very long <b>URL</b> in the input below and click on the button to make it shorter
        </div>
        <div class="input-group mb-3">
          <input type="text" id="urlInput" class="border-primary text-light bg-dark form-control" placeholder="Very long url..." onKeyPress$={(event) => handleShortenerKeypress$(event)} aria-label="url" aria-describedby="shortenerBtn" />
          <div class="input-group-append">
            <button type="button" id="shortenerBtn" class="btn btn-animation" onClick$={() => handleShortenerClick$()}>Shorten URL</button>
          </div>
        </div>
        <div id="loading" class="fade-in">
          <div class="lds-dual-ring"></div>
        </div>
        <div id="result" class="text-light">
          <p id="error" className="text-light fade-in"></p>
          <p id="text" className="text-light fade-in" onClick$={() => copyUrl$()}></p>
          <div id="action" className="d-none flex">
            <button type="button" className="btn btn-dark mr-1" onClick$={() => copyUrl$()}>
              <i className="bi bi-clipboard"></i>
            </button>
            <button type="button" className="btn btn-dark mr-1">
              <i className="bi bi-box-arrow-up-right" onClick$={() => openLink$()}></i>
            </button>
            <button type="button" className="btn btn-dark">
              <i className="bi bi-qr-code" onClick$={() => generateQRCode$()}></i>
            </button>
          </div>
        </div>
        <div id="qrcode" className="d-none flex-column align-items-center">
          <canvas className='m-2'></canvas>
          <a href="#qrcode" className="text-center text-white" onClick$={() => downloadQRCode$()}>Download QRCode</a>
        </div>
        <div id="urlAlert" className="alert alert-success collapse" role="alert">
          Link has been copied to the clipboard
        </div>
      </div>
      <div className="waves-div">
        <svg class="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
          </defs>
          <g class="parallax">
            {/* @ts-ignore */}
            <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
            {/* @ts-ignore */}
            <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            {/* @ts-ignore */}
            <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            {/* @ts-ignore */}
            <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'URL Shortener',
};
