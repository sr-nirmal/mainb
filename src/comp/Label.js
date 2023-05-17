import React from "react";
// import './Label.css'
import './receipt.css'
function Label({file_name,score,sustcolor,date}) {
    return (
        <div className="grid-header">
            <p className="file-name">{file_name}</p>
            <p className='lscore'>{score}</p>
            <p className="date-uploaded">{date}</p>
            <p className="Sustainability">{sustcolor}</p>
            <p className="date-uploaded" > </p>

        </div>
    );
}
export default Label;