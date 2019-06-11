import React from "react";
import {
  isSolved,
  detectCrosses,
  detectSolvedFaces,
  detectMiddleSolved,
  isF2L,
  isFacePlus,
  getOpposite,
  areCornersInPosition
} from "../../utils/missionUtils.js";
import { getFaceBlocks } from "../../utils/cubeUtils";
import { useCube } from "../../state/CubeContext.js";

import "./mission.scss";

const Mission = () => {
  const { blocks } = useCube();
  const cubeIsSolved = isSolved(blocks);
  const cubeCrosses = detectCrosses(blocks);
  const cubeFacesSolved = detectSolvedFaces(blocks);
  // const middlesSolved = detectMiddleSolved(blocks);
  // const bottomOfF2L = isF2L(cubeCrosses, middlesSolved);
  const bottomOfF2L = isF2L(blocks);
  // console.log(bottomOfF2L);
  const topColor = getOpposite(bottomOfF2L);
  const topFace = topColor && getFaceBlocks(topColor, blocks);
  const topIsPlus = bottomOfF2L && topFace && isFacePlus(topFace);
  const topIsCross = topColor && cubeCrosses && cubeCrosses.includes(topColor);
  const topCornersInPosition =
    topColor && areCornersInPosition(topColor, blocks);
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

export default Mission;
