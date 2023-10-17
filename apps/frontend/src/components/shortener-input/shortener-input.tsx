import { component$, useContext, $, useOnDocument, useSignal, QwikKeyboardEvent } from '@builder.io/qwik';
import { InputContext } from '../../routes';
import { ShortenerInputBtn } from './shortener-input-btn';
import { TIME_FRAME_DIR } from './constants';
import { useGetCurrentUser } from '../../routes/layout';
import { Select } from '../../components/select/select';
import { ArrowDoodle } from '../../components/arrow-doodle/arrow-doodle';

export interface ShortenerInputProps {
  onKeyUp$: (event: QwikKeyboardEvent<HTMLInputElement>) => void;
  onInput$: (event: InputEvent) => void;
  onSubmit$: () => void;
}

export const ShortenerInput = component$((props: ShortenerInputProps) => {
  const state = useContext(InputContext);
  const urlInput = useSignal<HTMLInputElement>();
  const selectExpirationTimeInputValue = useSignal<string>(TIME_FRAME_DIR.ONE_WEEK.name);

  const user = useGetCurrentUser();

  const handleSelectExpiredTime = $((value: any, key: any) => {
    selectExpirationTimeInputValue.value = key;
    state.ttl = value;
  });

  useOnDocument(
    'keydown',
    $((event) => {
      if ((event as KeyboardEvent).key === '/') {
        urlInput.value?.focus();
      }
    })
  );

  return (
    <div class="form-control">
      <div class="self-end  mr-[55px] hidden md:block">
        <div class="relative">
          <p class="ml-[100px]  text-2xl absolute " style={'font-family:Shadows Into Light Two'}>
            Expiration Time
          </p>
        </div>
        <ArrowDoodle />
      </div>
      <div class="md:input-group flex items-stretch mb-3 flex-col md:flex-row gap-2 md:gap-0 ">
        <input
          ref={urlInput}
          onKeyUp$={props.onKeyUp$}
          onInput$={props.onInput$}
          value={state.inputValue}
          type="text"
          id="urlInput"
          class="input input-bordered border-[hsl(var(--outline-border-color)] focus:outline-0 bg-base-200 flex-auto w-full md:w-auto mb-2 self-end"
          placeholder="Very long url..."
          aria-label="url"
          aria-describedby="shortenerBtn"
        />
        <div>
          <Select disabled={user.value?.verified ? false : true} selectInputValue={selectExpirationTimeInputValue}>
            <>
              {Object.values(TIME_FRAME_DIR).map(({ name: expirationTimeName, value: expirationTimeValue }) => (
                <li
                  value={expirationTimeValue || undefined}
                  key={expirationTimeName}
                  class="w-auto cursor-pointer  pl-4 py-1 dark:hover:bg-gray-700 hover:bg-gray-100"
                  onClick$={$(() => handleSelectExpiredTime(expirationTimeValue, expirationTimeName))}
                >
                  {expirationTimeName}
                </li>
              ))}
            </>
          </Select>
          <div class="text-xs text-gray-500 text-start px-2 pt-1 md:hidden">Expiration Time</div>
        </div>

        <ShortenerInputBtn disabled={state.inputValue.length === 0} onClick$={props.onSubmit$} />
      </div>
    </div>
  );
});
