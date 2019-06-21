import React from "react";
import "./Summary.scss";
//TODO: Handle cases other than success
//TODO: Add stats
//TODO: Add confetti
const Summary = ({ reset, startTime, endTime }) => (
  <div className="Summary">
    <h1 className="Summary__header">Congratulations!</h1>
    <div className="Summary__body">
      <div>You finished in</div>
      <div className="Summary__time">{`${msToTime(endTime - startTime)}s`}</div>
      <div className="Summary__buttonContainer">
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  </div>
);

// TODO: Remove to utility file. Also used in Objectives
// The timer
const normalize = number => (number < 10 ? `0${number}` : number);
const msToTime = duration => {
  const milliseconds = parseInt((duration % 1000) / 10, 10),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor(duration / (1000 * 60));
  return `${minutes > 0 ? `${normalize(minutes)}:` : ""}${normalize(
    seconds
  )}.${normalize(milliseconds)}`;
};

export default Summary;
