import { component$, useRef } from "@builder.io/qwik";
import { handleShortenerClick } from "./handleShortener";
import { ShortenerInputBtn } from "./shortener-input-btn";

export interface ShortenerInputProps {
    ref: any;
    onKeyUp$: (event: KeyboardEvent) => void;
}

export const ShortenerInput = component$((props: ShortenerInputProps) => {

    const shortenerInputBtnRef = useRef();

    return (
    <div class="input-group mb-3">
        <input
            ref={props.ref}
            onKeyUp$={props.onKeyUp$}
            type="text" 
            id="urlInput"
            class="border-primary text-light bg-dark form-control"
            placeholder="Very long url..."
            aria-label="url"
            aria-describedby="shortenerBtn" 
        />
        <div class="input-group-append">
            <ShortenerInputBtn
                ref={shortenerInputBtnRef}
                onClick$={() => handleShortenerClick()}
            >

            </ShortenerInputBtn>
        </div>
    </div>
    )
})