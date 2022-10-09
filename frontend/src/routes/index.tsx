import { $, component$, useStylesScoped$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import animations from '../assets/css/animations.css?inline';
import loader from '../assets/css/loader.css?inline';
import styles from './index.css?inline';

export default component$(() => {
  useStylesScoped$(animations)
  useStylesScoped$(styles)
  useStylesScoped$(loader)

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

    loader!.style.display = "block";
    result!.style.display = "none";
    /**
     * fixx so xyz.com works as well as https://xyz.com
     * 
     */
    let ValidUrl = urlInput!.value; 
    //Tests for https  , http and empty string . 
    
  if (!RegExp("^https://").test(urlInput!.value) && !RegExp("^http://").test(urlInput!.value) && urlInput!.value ) {
    
    ValidUrl = `https://${urlInput!.value}`; 
  
  }
  const { newUrl } = await getShortenUrl$(ValidUrl);



    //const { newUrl } = await getShortenUrl$(urlInput!.value);
    






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
          Add your very long <b>URL</b> in the input bellow and click on the button to make it shorter
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
            <button type="button" className="btn btn-dark">
              <i className="bi bi-box-arrow-up-right" onClick$={() => openLink$()}></i>
            </button>
          </div>
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
