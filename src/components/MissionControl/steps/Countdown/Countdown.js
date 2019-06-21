import React, { useEffect, useRef, useState } from "react";
import "./Countdown.scss";
import { useCube } from "../../../../state/CubeContext.js";

const Countdown = ({ start, onMove, canSkip, countdownDuration }) => {
  // Check if the user has moved the cube
  const { moveHistory } = useCube();
  const lastMove = moveHistory[moveHistory.length - 1];
  // keeping a record of move time to ensure that we use our effect only once
  const lastMoveTime = lastMove && lastMove.time;
  const previousMoveTime = React.useRef(lastMoveTime);
  useEffect(() => {
    if (lastMoveTime !== previousMoveTime.current) {
      // if the user has moved, use the predefined callback
      onMove();
    }
  }, [lastMoveTime, onMove]);

  // Handle dynamic countdown time
  const startTime = useRef(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const tick = () => {
      setCurrentTime(new Date());
    };
    const timerID = setInterval(() => tick(), 100);
    return () => {
      clearInterval(timerID);
    };
  });
  const msElapsed =
    currentTime && startTime.current ? currentTime - startTime.current : 0;
  const secondsRemaining = Math.ceil(countdownDuration - msElapsed / 1000);

  // If time up, continue
  useEffect(() => {
    if (secondsRemaining <= 0) {
      start();
    }
  }, [secondsRemaining, start]);

  return (
    <React.Fragment>
      <div className="Countdown__header">
        <h2>Investigate the cube</h2>
      </div>
      {secondsRemaining > 0 && (
        <div className="Countdown__time">{`${secondsRemaining}s`}</div>
      )}
      <div className="Countdown__footer">
        {canSkip && <button onClick={start}>Start</button>}
      </div>
    </React.Fragment>
  );
};

export default Countdown;
