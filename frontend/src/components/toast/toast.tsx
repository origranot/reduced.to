import { component$ } from "@builder.io/qwik";

export interface ToastProps {
    id: string
    className: string
    text: string
}

export const Toast = component$((props: ToastProps) => {
    return (
        <div 
            id={props.id} 
            className={props.className} 
            role="alert"
        >
            {props.text}
        </div>
    )
})