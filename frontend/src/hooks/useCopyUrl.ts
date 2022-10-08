import {useToastAlert} from "./useToastAlert";
import React from "react";

export const useCopyUrl = (ref: React.MutableRefObject<any>) => {

    const [alert] = useToastAlert(ref)
    const copy = (url: string) => {
        navigator.clipboard.writeText(url)
            .then(alert())
    }
    return [copy] as [(url: string) => null]
}