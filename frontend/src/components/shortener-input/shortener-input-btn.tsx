import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from './shortener-input-btn.css?inline';

export interface ShortenerInputBtnProps {
    ref: any;
    onClick$: () => void;
}

export const ShortenerInputBtn = component$((props: ShortenerInputBtnProps) => {
    useStylesScoped$(styles)

    return (
        <button 
            ref={props.ref}
            onClick$={props.onClick$}
            type="button"
            id="shortenerBtn"
            class="btn btn-primary"
        >Shorten URL</button>
    )
})