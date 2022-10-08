import React from "react";

export const useToastAlert = (ref: React.MutableRefObject<any>) => {
    const urlAlert = ref.current;

    const alert = (timeoutInMilliseconds = 2000) => {
        urlAlert?.classList.add('fade-in');
        urlAlert?.classList.remove('collapse');

        setTimeout(() => {
            urlAlert?.classList.remove('fade-in');
            urlAlert?.classList.add('fade-out');

            setTimeout(() => {
                urlAlert?.classList.add('collapse');
                urlAlert?.classList.remove('fade-out');
            }, 500);
        }, timeoutInMilliseconds);
    }

    return [alert] as [
        (timeoutInMilliseconds?: number) => null,
    ]
}