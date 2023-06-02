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
import { Select } from '~/components/select/Select';

export interface ShortenerInputProps {
  onKeyUp$: (event: QwikKeyboardEvent<HTMLInputElement>) => void;
  onInput$: (event: InputEvent) => void;
  onSubmit$: () => void;
}

export const ShortenerInput = component$((props: ShortenerInputProps) => {
  const state = useContext(InputContext);
  const searchInput = useSignal<HTMLInputElement>();
  const selectInputValue = useSignal<string>(timeFrameArr[0].key);

  // TODO: add role functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const role = useGetCurrentUser().value?.role;

  const handleSelectExpiredTime = $((value: any, key: any) => {
    console.log(value, key);
    selectInputValue.value = key;
    state.expirationTime = value;
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
          <Select disabled={role ? false : true} selectInputValue={selectInputValue}>
            {timeFrameArr.map(({ key, value }) => (
              <li
                value={value}
                key={key}
                class="w-auto cursor-pointer pl-4 py-1 hover:bg-gray-200"
                onClick$={$(() => handleSelectExpiredTime(value, key))}
              >
                {key}
              </li>
            ))}

            {role === 'ADMIN' && (
              <>
                <hr />
                <li
                  key={'never'}
                  class="w-auto cursor-pointer pl-4 py-1 hover:bg-gray-200"
                  onClick$={$(() => handleSelectExpiredTime(null, 'Never'))}
                >
                  Never
                </li>
              </>
            )}
          </Select>
        </div>
        <ShortenerInputBtn disabled={state.inputValue.length === 0} onClick$={props.onSubmit$} />
      </div>
    </div>
  );
});
