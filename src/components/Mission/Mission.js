import React, { useEffect, useState } from "react";
import {
  isSolved,
  detectCrosses,
  detectSolvedFaces,
  isF2L,
  isFacePlus,
  getOpposite,
  areCornersInPosition,
  isFaceSingleColor
} from "../../utils/missionUtils.js";
import { getFaceBlocks } from "../../utils/cubeUtils";
import { useCube } from "../../state/CubeContext.js";

import "./mission.scss";

const normalize = number => (number < 10 ? `0${number}` : number);

const msToTime = duration => {
  const milliseconds = parseInt((duration % 1000) / 10, 10),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor(duration / (1000 * 60));
  return `${minutes > 0 ? `${normalize(minutes)}:` : ""}${normalize(
    seconds
  )}:${normalize(milliseconds)}`;
};

const getResolved = blocks => {
  const cubeIsSolved = isSolved(blocks);
  const cubeCrosses = detectCrosses(blocks);
  const cubeFacesSolved = detectSolvedFaces(blocks);
  const bottomOfF2L = isF2L(blocks);
  const topColor = getOpposite(bottomOfF2L);
  const topFace = topColor && getFaceBlocks(topColor, blocks);
  const topIsPlus = bottomOfF2L && topFace && isFacePlus(topFace);
  const topIsCross = topColor && cubeCrosses && cubeCrosses.includes(topColor);
  const topCornersInPosition =
    topColor && areCornersInPosition(topColor, blocks);
  const isOll = topCornersInPosition && isFaceSingleColor(topFace);

  return {
    cubeIsSolved,
    cubeCrosses,
    cubeFacesSolved,
    bottomOfF2L,
    topColor,
    topFace,
    topIsPlus,
    topIsCross,
    topCornersInPosition,
    isOll
  };
};

const getObjectives = ({ blocks }) => {
  const {
    cubeIsSolved,
    cubeCrosses,
    cubeFacesSolved,
    bottomOfF2L,
    topIsPlus,
    topIsCross,
    topCornersInPosition,
    isOll
  } = getResolved(blocks);
  return [
    {
      text: "bottom cross",
      check: cubeCrosses && cubeCrosses.length > 0
    },
    {
      text: "bottom solved",
      check: cubeFacesSolved && cubeFacesSolved.length > 0
    },
    {
      text: "first 2 layers",
      check: bottomOfF2L && bottomOfF2L.length > 0
    },
    { text: "top is plus", check: topIsPlus },
    { text: "top cross", check: topIsCross },
    { text: "top corners", check: topCornersInPosition },
    { text: "isOLL", check: isOll },
    { text: "solved", check: cubeIsSolved }
  ];
};

const Mission = () => {
  // Set up state for stopwatch
  const [startTime, setStartTime] = useState(null);

  // Set up objectives based on cube state
  const { blocks, moveHistory } = useCube();
  const { cubeIsSolved } = getResolved(blocks);

  const objectives = getObjectives({
    blocks
  });

  const [timesResolved, setTimesResolved] = useState([]);
  const [endTime, setEndTime] = useState(null);

  const stopWatchProps = { startTime, setStartTime, endTime, setEndTime };

  // if solved, stop timer
  useEffect(() => {
    if (cubeIsSolved && startTime && !endTime) {
      const elapsedTime = new Date() - startTime;
      setEndTime(elapsedTime);
      setStartTime(null);
      setTimesResolved([]);
    }
  }, [cubeIsSolved, endTime, startTime]);

  /*useEffect(() => {
    const objectives = getObjectives({
      blocks
    });

    if (!cubeIsSolved) {
      const all = objectives.map((objective, i) => {
        if (objective.check) {
          console.log({ objective });
          if (timesResolved[i]) return timesResolved[i];

          return msToTime(Date.now() - startTime);
        }
        return timesResolved[i] ? timesResolved[i] : undefined;
      });

      setTimesResolved(all);
    }
  }, [blocks, cubeIsSolved, startTime, timesResolved]);
*/
  return (
    <div className="Missions">
      <StopWatch {...stopWatchProps} />
      <ul className="objectives">
        {objectives.map(({ text, check }, i) => (
          <li
            key={text}
            className={check ? "objective objective--complete" : "objective"}
          >
            {`${text}: ${check ? "YES" : "NO"}`}
            {timesResolved[i] && (
              <span className="time">{timesResolved[i]}</span>
            )}
          </li>
        ))}
      </ul>
      <div className="Missions__moves">
        {moveHistory && (
          <React.Fragment>
            {moveHistory.length} moves
            <div>{moveHistory.join("\r\n")}</div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

const StopWatch = React.memo(
  ({ startTime, setStartTime, endTime, setEndTime }) => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
      const tick = () => {
        setDate(new Date());
      };
      const timerID = setInterval(() => tick(), 10);
      return () => {
        clearInterval(timerID);
      };
    });

    let elapsedTime;
    let stopWatchFunction;
    let stopWatchWording;
    if (endTime) {
      elapsedTime = endTime;
      stopWatchWording = "reset";
      stopWatchFunction = () => {
        setStartTime(null);
        setEndTime(null);
      };
    } else {
      if (startTime && date) {
        elapsedTime = date - startTime;
        if (elapsedTime < 0) {
          elapsedTime = 0;
        }
        stopWatchWording = "stop";
        stopWatchFunction = () => {
          setEndTime(elapsedTime);
        };
      } else {
        elapsedTime = 0;
        stopWatchWording = "start";
        stopWatchFunction = () => {
          setEndTime(null);
          setStartTime(Date.now());
        };
      }
    }
    return (
      <div>
        <h2 style={{ fontFamily: "monospace" }}>{msToTime(elapsedTime)}</h2>
        <button onClick={stopWatchFunction}>{stopWatchWording}</button>
      </div>
    );
  }
);

export default Mission;
