import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from './loader.css?inline';

export const Loader = component$(() => {
    useStylesScoped$(styles)

    return(
        <div id="loading" class="hidden fade-in">
            <div class="lds-dual-ring"></div>
        </div>
    )
})