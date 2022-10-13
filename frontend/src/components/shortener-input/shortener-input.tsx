import { component$, useContext, useRef } from "@builder.io/qwik";
import { InputContext, Store } from "~/routes";
import { handleShortener } from "./handleShortener";
import { ShortenerInputBtn } from "./shortener-input-btn";

export interface ShortenerInputProps {
  ref: any;
  onKeyUp$: (event: KeyboardEvent) => void;
  onInput$: (event: InputEvent) => void;
  onSubmit$: () => void;
}

export const ShortenerInput = component$((props: ShortenerInputProps) => {
  const state: Store = useContext(InputContext) as Store;
  const shortenerInputBtnRef = useRef();
  return (
    <div className="form-control m-3 md:m-0  ">
      <div class="input-group md:m-3  flex flex-col md:flex-row">
        <input
          ref={props.ref}
          onKeyUp$={props.onKeyUp$}
          onInput$={props.onInput$}
          value={state.inputValue}
          type="text"
          id="urlInput"
          class="input input-bordered bg-base-200 flex-auto"
          placeholder="Very long url..."
          aria-label="url"
          aria-describedby="shortenerBtn"
        />
        <ShortenerInputBtn
          ref={shortenerInputBtnRef}
          disabled={state.inputValue.length === 0}
          onClick$={() => handleShortener(state)}
        />
      </div>
    </div>
  );
});

