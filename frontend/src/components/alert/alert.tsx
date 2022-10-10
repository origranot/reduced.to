import { component$ } from "@builder.io/qwik";

export interface AlertProps {
    id: string
    className: string
    text: string
}

export const Alert = component$((props: AlertProps) => {
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