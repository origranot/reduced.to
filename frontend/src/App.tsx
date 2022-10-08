import {Waves} from "./components/Waves";
import {Loading} from "./components/Loading";
import {useRef, useState} from "react";
import {useShortenUrl} from "./hooks/useShortenUrl";
import {useCopyUrl} from "./hooks/useCopyUrl";
import React from 'react';


function App() {

    const alertRef = useRef(null);
    const [url, setUrl] = useState('');
    const [copy] = useCopyUrl(alertRef);
    const [result, error, loading, shorten, api] = useShortenUrl()

    const copyUrl = () => {
        if (result?.newUrl) {
            const n = api + result.newUrl;
            copy(n);
        }
    }

    const openLink = () => {
        if (result?.newUrl) {
            const n = window.location.href + result.newUrl;
            window.open(n, '_blank');
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
                <form className="input-group mb-3" onSubmit={(e) => {
                    e.preventDefault();
                    shorten(url).then(copyUrl);
                }}>
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
                                        {window.location.href} {result?.newUrl}
                                    </p>

                                    <div id="action" className="d-block flex">
                                        <button className="btn btn-dark mr-1" onClick={() => copyUrl()}>
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
