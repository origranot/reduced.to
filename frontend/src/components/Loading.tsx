import React from "react";

export const Loading = () => {
    return (
        <div id="loading" className="fade-in" style={{display: 'block'}}>
            <div className="lds-dual-ring"></div>
        </div>
    )
}