import React from "react";
import "./MissionStart.scss";

const MissionStart = ({ title, handleStart }) => (
  <React.Fragment>
    <div className="MissionStart__header">
      <h2>Mission: {title}</h2>
    </div>
    <div className="MissionStart__footer">
      <button onClick={handleStart}>Start</button>
    </div>
  </React.Fragment>
);

export default MissionStart;
