import {Waves} from "./components/Waves";
import {Loading} from "./components/Loading";
import {FormEvent, useEffect, useRef, useState} from "react";
import {useShortenUrl} from "./hooks/useShortenUrl";
import {useCopyUrl} from "./hooks/useCopyUrl";
import React from 'react';


function App() {

    const alertRef = useRef(null);
    const [copy] = useCopyUrl(alertRef);
    const [url, setUrl, result, error, loading, shorten, api] = useShortenUrl()

    const [shortUrl, setShortUrl] = useState("");

    useEffect(() => {
        if (result?.newUrl) {
            setShortUrl(api + result.newUrl)
            copy(api + result.newUrl)
        }
    }, [result]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await shorten(url)
    }

    const openLink = () => {
        if (result?.newUrl) {
            window.open(shortUrl, '_blank');
        }
    }

    return (
        <div className="">
            <div className="container center">
                <h1 className="p-3 text-light font-weight-bold">
                    URL Shortener
                </h1>
                <div className="alert alert-primary" role="alert">
                    Add your very long <b>URL</b> in the input below and click on the button to make it shorter
                </div>
                <form className="input-group mb-3" onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" id="urlInput" className="border-primary text-light bg-dark form-control"
                           placeholder="Very long url.." aria-label="url" aria-describedby='shortenerBtn'
                           value={url}
                           onChange={(e) => setUrl(e.target.value)}
                    />
                    <div className="input-group-append">
                        <button type={"submit"} id="shortenerBtn" className="btn btn-animation">Shorten URL</button>
                    </div>
                </form>

                {
                    loading ?
                        <Loading/> :
                        <div id="result" className="text-light">
                            {
                                error && <p id="error" className="text-light fade-in">This url is invalid..</p>
                            }
                            {
                                result && result.newUrl && <>
                                    <p id="text" className="text-light fade-in">
                                        {api}{result?.newUrl}
                                    </p>

                                    <div id="action" className="d-block flex">
                                        <button className="btn btn-dark mr-1" onClick={() => copy(shortUrl)}>
                                            <i className="bi bi-clipboard"></i>
                                        </button>
                                        <button className="btn btn-dark" onClick={() => openLink()}>
                                            <i className="bi bi-box-arrow-up-right"></i>
                                        </button>
                                    </div>
                                </>
                            }
                        </div>
                }

                <div id="urlAlert" className="alert alert-success collapse" role="alert" ref={alertRef}>
                    Link has been copied to the clipboard
                </div>
            </div>
            <Waves/>
        </div>
    )
}

export default App
