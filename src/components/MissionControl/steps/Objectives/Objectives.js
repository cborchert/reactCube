import React, { useEffect, useRef, useState } from "react";
import { useCube } from "../../../../state/CubeContext.js";
import { cubeStateToStringState } from "../../../../utils/cubeUtils.js";
import "./Objectives.scss";

const ObjectivesStep = ({
  setStartTime,
  startTime,
  objectives,
  objectiveTimes,
  setMultipleObjectiveTimes,
  initObjectivesStep
}) => {
  const { blocks, setCubeState, resetCubeHistory } = useCube();
  const [isInit, setInit] = useState(false);

  const theObjectives = objectives.map((objective, i) => {
    return { ...objective, complete: !!objectiveTimes[i], index: i };
  });
  const currentObjective = theObjectives.find(({ complete }) => !complete);
  const currentObjectiveTitle = currentObjective && currentObjective.text;

  // Initialize the timer and reset cube history on mount
  useEffect(() => {
    setStartTime(new Date());
    resetCubeHistory();
    setInit(true);
    // If the objectives step has not been inited, do it now
    if (objectives.length !== objectiveTimes.length) {
      initObjectivesStep();
    }
    // If the first objective has an init step, take it
    if (currentObjective && typeof currentObjective.setBlocks === "function") {
      setCubeState(currentObjective.setBlocks(blocks));
    }
    // only want component did mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: Checking movement in the cube should be custom useEffect (it's reused in several places)
  // When the user moves the cube, check the objectives
  const blockState = cubeStateToStringState(blocks);
  const previousBlockState = useRef(null);
  useEffect(() => {
    if (isInit && blockState !== previousBlockState.current) {
      previousBlockState.current = blockState;
      // if the movement results in passed objectives, update
      const theTime = new Date();
      // only check those which are not complete, and get their indices
      const newlyPassedObjectives = theObjectives.filter(
        ({ complete, check }) =>
          !complete && check(blocks, currentObjectiveTitle)
      );
      const newlyPassedIndices = newlyPassedObjectives.map(
        ({ index }, i) => index
      );
      // add the new passed times
      if (newlyPassedIndices.length > 0) {
        setMultipleObjectiveTimes(newlyPassedIndices, theTime);

        // go through init step for next objective
        const nextObjective = theObjectives.find(
          ({ complete, index }) =>
            !complete && !newlyPassedIndices.includes(index)
        );
        if (nextObjective && typeof nextObjective.setBlocks === "function") {
          setCubeState(nextObjective.setBlocks(blocks));
        }
      }
    }
  }, [
    blockState,
    blocks,
    currentObjective,
    currentObjective.text,
    currentObjectiveTitle,
    isInit,
    setCubeState,
    setMultipleObjectiveTimes,
    theObjectives
  ]);

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
