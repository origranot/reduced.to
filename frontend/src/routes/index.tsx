import { component$, useRef, useStylesScoped$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { GithubButton } from '~/components/github-button/github-button';
import { copyUrl, handleShortenerOnKeyUp, openLink } from '~/components/shortener-input/handleShortener';
import { ShortenerInput } from '~/components/shortener-input/shortener-input';
import { Waves } from '~/components/waves/waves';
import animations from '../assets/css/animations.css?inline';
import loader from '../assets/css/loader.css?inline';
import styles from './index.css?inline';

export default component$(() => {
  useStylesScoped$(animations)
  useStylesScoped$(styles)
  useStylesScoped$(loader)

  const shortenerInputRef = useRef();

  return (
    <>
      <div class="container">
        <div className="d-flex flex-row-reverse my-5">
          <GithubButton type="Star" user="origranot" repo="url-shortener" isLarge showCount label="Star"></GithubButton>
        </div>
      </div>
      <div class="container">
        <h1 class="p-3 text-light font-weight-bold">
          URL Shortener
        </h1>
        <div class="alert alert-primary" role="alert">
          Add your very long <b>URL</b> in the input bellow and click on the button to make it shorter
        </div>
        <ShortenerInput
          ref={shortenerInputRef}
          onKeyUp$={(event) => handleShortenerOnKeyUp(event) }
        ></ShortenerInput>
        <div id="loading" class="fade-in">
          <div class="lds-dual-ring"></div>
        </div>
        <div id="result" class="text-light">
          <p id="error" className="text-light fade-in"></p>
          <p id="text" className="text-light fade-in" onClick$={() => copyUrl()}></p>
          <div id="action" className="d-none flex">
            <button type="button" className="btn btn-dark mr-1" onClick$={() => copyUrl()}>
              <i className="bi bi-clipboard"></i>
            </button>
            <button type="button" className="btn btn-dark">
              <i className="bi bi-box-arrow-up-right" onClick$={() => openLink()}></i>
            </button>
          </div>
        </div>
        <div id="urlAlert" className="alert alert-success collapse" role="alert">
          Link has been copied to the clipboard
        </div>
      </div>
      <Waves/>
    </>
  );
});

export const head: DocumentHead = {
  title: 'URL Shortener',
};
