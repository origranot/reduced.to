import {
  component$,
  useContext,
  $,
  useOnDocument,
  useSignal,
  QwikKeyboardEvent,
  QwikChangeEvent,
} from '@builder.io/qwik';
import { InputContext } from '~/routes';
import { ShortenerInputBtn } from './shortener-input-btn';
import { timeFrameArr } from '~/constants';
import { useGetCurrentUser } from '~/routes/layout';

export interface ShortenerInputProps {
  onKeyUp$: (event: QwikKeyboardEvent<HTMLInputElement>) => void;
  onInput$: (event: InputEvent) => void;
  onSubmit$: () => void;
}

export const ShortenerInput = component$((props: ShortenerInputProps) => {
  const state = useContext(InputContext);
  const searchInput = useSignal<HTMLInputElement>();

  // TODO: add role functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userCtx = useGetCurrentUser().value;

  const handleSelectExpiredTime = $((event: QwikChangeEvent<HTMLSelectElement>) => {
    state.expiredTime = +event.target.value;
  });

  useOnDocument(
    'keydown',
    $((event) => {
      if ((event as KeyboardEvent).key === '/') {
        searchInput.value?.focus();
      }
    })
  );

  return (
    <div class="form-control">
      <div class="sm:input-group mb-3 flex-col sm:flex-row gap-2 sm:gap-0 ">
        <input
          ref={searchInput}
          onKeyUp$={props.onKeyUp$}
          onInput$={props.onInput$}
          value={state.inputValue}
          type="text"
          id="urlInput"
          class="input input-bordered focus:outline-0 bg-base-200 flex-auto w-full sm:w-auto mb-2 self-end"
          placeholder="Very long url..."
          aria-label="url"
          aria-describedby="shortenerBtn"
        />
        <div>
          <label class="label">
            <div class="label-text bg-transparent">Pick Url expiration Time</div>
          </label>
          <select
            class="select select-bordered mb-2 w-full rounded-none focus:outline-0"
            onChange$={handleSelectExpiredTime}
          >
            {timeFrameArr.map(({ key, value }) => (
              <option value={value} key={key} class="shadow bg-base-100 rounded-box">
                {key}
              </option>
            ))}
          </select>
        </div>
        <ShortenerInputBtn disabled={state.inputValue.length === 0} onClick$={props.onSubmit$} />
      </div>
    </div>
  );
});
