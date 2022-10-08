/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
import {useState} from "react";

export function useShortenUrl() {
    const [result, setResult] = useState();
    const [error, setError] = useState<any>();
    const [loading, setLoading] = useState(false);
    const api = import.meta.env.PROD ? window.location.origin : import.meta.env.VITE_API_URL;

    const shorten = async (originalUrl: string) => {
        setLoading(true)
        setResult(undefined)
        setError(undefined)
        try {
            await fetch(`${api}/api/v1/shortener`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({originalUrl})
            })
                .then(async (response) => {
                    const json = await response.json();
                    if (!response.ok) {
                        setError(json)
                    } else {
                        setResult(json)
                    }
                })
                .catch((err) => {
                    setError(err)
                })
                .finally(() => setLoading(false))
        } catch (err) {
            return setError(err)
        }
    }

    return [result, error, loading, shorten, api] as [
        any,
        any,
        boolean,
        (originalUrl: string) => Promise<any>,
        string
    ]
}