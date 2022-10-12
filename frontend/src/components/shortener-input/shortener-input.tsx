import { component$, useContext, useRef } from "@builder.io/qwik";
import { InputContext, Store } from "~/routes";
import { handleShortener } from "./handleShortener";
import { ShortenerInputBtn } from "./shortener-input-btn";

export interface ShortenerInputProps {
    ref: any;
    onKeyUp$: ({ store }: any) => void;
}

export const ShortenerInput = component$((props: ShortenerInputProps) => {
  const state: Store = useContext(InputContext) as Store;

  const shortenerInputBtnRef = useRef();
    return (
    <div class="input-group mb-3 flex">
        <input
            ref={props.ref}
            onKeyUp$={props.onKeyUp$}
            type="text" 
            id="urlInput"
            class="input input-bordered bg-base-200 flex-auto"
            placeholder="Very long url..."
            aria-label="url"
            aria-describedby="shortenerBtn" 
        />
            <ShortenerInputBtn
                ref={shortenerInputBtnRef}
                onClick$={() => handleShortener({state})}
            >
            </ShortenerInputBtn>
    </div>
    )
})