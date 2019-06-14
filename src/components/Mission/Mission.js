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

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 10),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor(duration / (1000 * 60));

  milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return minutes + ":" + seconds + "." + milliseconds;
}

const Mission = () => {
  const { blocks } = useCube();

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

  const objectives = [
    { text: "bottom cross", check: cubeCrosses && cubeCrosses.length > 0 },
    {
      text: "bottom solved",
      check: cubeFacesSolved && cubeFacesSolved.length > 0
    },
    { text: "first 2 layers", check: bottomOfF2L },
    { text: "top is plus", check: topIsPlus },
    { text: "top cross", check: topIsCross },
    { text: "top corners", check: topCornersInPosition },
    { text: "isOLL", check: isOll },
    { text: "solved", check: cubeIsSolved }
  ];

  return (
    <div className="Missions">
      <ul className="objectives">
        {objectives.map(({ text, check }) => (
          <li
            key={text}
            className={check ? "objective objective--complete" : "objective"}
          >{`${text}: ${check ? "YES" : "NO"}`}</li>
        ))}
      </ul>
    </div>
  );
};

const StopWatch = React.memo(() => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
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
  if (finishTime) {
    elapsedTime = finishTime;
    stopWatchWording = "reset";
    stopWatchFunction = () => {
      setStartTime(null);
      setFinishTime(null);
    };
  } else {
    if (startTime && date) {
      elapsedTime = date - startTime;
      if (elapsedTime < 0) {
        elapsedTime = 0;
      }
      stopWatchWording = "stop";
      stopWatchFunction = () => {
        setFinishTime(elapsedTime);
      };
    } else {
      elapsedTime = 0;
      stopWatchWording = "start";
      stopWatchFunction = () => {
        setFinishTime(null);
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
});

export default Mission;
