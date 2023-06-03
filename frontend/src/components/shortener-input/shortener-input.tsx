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
      <div class="self-end  mr-[55px] hidden md:block">
        <p class="ml-[100px] text-2xl absolute " style={'font-family:Shadows Into Light Two'}>
          Expiration Time
        </p>
        <img src="/images/arrrow-doodle.svg" class="max-w-[100px] rotate-[25deg]" />
      </div>
      <div class="md:input-group flex items-stretch mb-3 flex-col md:flex-row gap-2 md:gap-0 ">
        <input
          ref={searchInput}
          onKeyUp$={props.onKeyUp$}
          onInput$={props.onInput$}
          value={state.inputValue}
          type="text"
          id="urlInput"
          class="input input-bordered focus:outline-0 bg-base-200 flex-auto w-full md:w-auto mb-2 self-end"
          placeholder="Very long url..."
          aria-label="url"
          aria-describedby="shortenerBtn"
        />
        <div>
          <Select disabled={role ? false : true} selectInputValue={selectInputValue}>
            <>
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
            </>
          </Select>
          <div class="text-xs text-gray-500 text-start px-2 pt-1 md:none">Expiration Time</div>
        </div>

        <ShortenerInputBtn disabled={state.inputValue.length === 0} onClick$={props.onSubmit$} />
      </div>
    </div>
  );
});
