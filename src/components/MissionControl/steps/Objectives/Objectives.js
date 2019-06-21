import React, { useEffect, useRef, useState } from "react";
import "./Objectives.scss";
import { useCube } from "../../../../state/CubeContext.js";
import { cubeStateToStringState } from "../../../../utils/cubeUtils.js";

const ObjectivesStep = ({
  setStartTime,
  startTime,
  objectives,
  objectiveTimes,
  setMultipleObjectiveTimes
}) => {
  const { blocks, resetCubeHistory } = useCube();

  // Initialize the timer and reset cube history
  useEffect(() => {
    setStartTime(new Date());
    resetCubeHistory();
    // only want component did mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theObjectives = objectives.map((objective, i) => {
    return { ...objective, complete: !!objectiveTimes[i], index: i };
  });

  // TODO: Checking movement in the cube should be custom
  // Check if the user has moved the cube
  const blockState = cubeStateToStringState(blocks);
  // setting this to null forces the useEffect to be used the first time
  const previousBlockState = useRef(null);
  useEffect(() => {
    if (blockState !== previousBlockState.current) {
      previousBlockState.current = blockState;
      // if the movement results in passed objectives, update
      const theTime = new Date();
      // only check those which are not complete, and get their indices
      const newlyPassedIndices = theObjectives
        .filter(({ complete }) => !complete)
        .filter(({ check }) => check(blocks))
        .map(({ index }, i) => index);
      // add the new passed times
      if (newlyPassedIndices.length > 0) {
        setMultipleObjectiveTimes(newlyPassedIndices, theTime);
      }
    }
  }, [blockState, blocks, setMultipleObjectiveTimes, theObjectives]);

  return (
    <React.Fragment>
      <ul className="Objectives__stepper">
        {theObjectives.map(({ text, complete }) => (
          <li
            className={`Objectives__step${
              complete ? ` Objectives__step--complete` : ""
            }`}
            key={text}
          >
            {text}
          </li>
        ))}
      </ul>
      <div className="Objectives__footer">
        <Stopwatch startTime={startTime} />
      </div>
    </React.Fragment>
  );
};

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

// TODO: Optimize for perf, especially when dragging around the scene
const Stopwatch = React.memo(({ startTime }) => {
  const [date, setDate] = useState(new Date());
  //every 50ms we'll update
  useEffect(() => {
    const tick = () => {
      setDate(new Date());
    };
    const timerID = setInterval(() => tick(), 50);
    return () => {
      clearInterval(timerID);
    };
  });
  const elapsedTime = date - startTime;
  return (
    <div>
      <h2 style={{ fontFamily: "monospace" }}>{msToTime(elapsedTime)}</h2>
    </div>
  );
});

export default ObjectivesStep;
