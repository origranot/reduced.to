/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
import {useEffect, useState} from "react";

export function useShortenUrl() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState();
    const [error, setError] = useState<any>();
    const [loading, setLoading] = useState(false);
    const api = import.meta.env.PROD ? window.location.href : import.meta.env.VITE_API_URL;

    const shorten = async (originalUrl: string) => {
        setLoading(true)
        setResult(undefined)
        setError(undefined)
        try {
            await fetch(`${api}api/v1/shortener`, {
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

    useEffect(() => {
        setError(undefined)
        setResult(undefined)
    }, [url]);
    
    return [url, setUrl, result, error, loading, shorten, api] as [
        string,
        any,
        any,
        any,
        boolean,
        (originalUrl: string) => Promise<any>,
        string
    ]
}