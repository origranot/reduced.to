import {
  component$,
  useContext,
  $,
  useOnDocument,
  useSignal,
  QwikKeyboardEvent,
} from '@builder.io/qwik';
import { InputContext } from '~/routes';
import { ShortenerInputBtn } from './shortener-input-btn';

export interface ShortenerInputProps {
  onKeyUp$: (event: QwikKeyboardEvent<HTMLInputElement>) => void;
  onInput$: (event: InputEvent) => void;
  onSubmit$: () => void;
}

export const ShortenerInput = component$((props: ShortenerInputProps) => {
  const state = useContext(InputContext);
  const searchInput = useSignal<HTMLInputElement>();

  useOnDocument(
    'keydown',
    $((event) => {
      if ((event as KeyboardEvent).key === '/') {
        event.preventDefault();
        searchInput.value?.focus();
      }
    })
  );

  return (
    <div class="form-control">
      <div class="sm:input-group mb-3 flex-col sm:flex-row gap-2 sm:gap-0">
        <input
          ref={searchInput}
          onKeyUp$={props.onKeyUp$}
          onInput$={props.onInput$}
          value={state.inputValue}
          type="text"
          id="urlInput"
          class="input input-bordered focus:outline-0 bg-base-200 flex-auto w-full sm:w-auto mb-2"
          placeholder="Very long url..."
          aria-label="url"
          aria-describedby="shortenerBtn"
        />
        <ShortenerInputBtn disabled={state.inputValue.length === 0} onClick$={props.onSubmit$} />
      </div>
    </div>
  );
});
