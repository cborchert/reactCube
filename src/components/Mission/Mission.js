import React from "react";
import { isSolved, detectCrosses } from "../../utils/missionUtils.js";
import { useCube } from "../../state/CubeContext.js";

const Mission = () => {
  const { blocks } = useCube();
  const cubeIsSolved = isSolved(blocks);
  const cubeCrosses = detectCrosses(blocks);
  return (
    <div>
      <ul>
        <li>hasCross: {cubeCrosses && cubeCrosses.length > 0 ? "Y" : "N"}</li>
        <li>isSolved: {cubeIsSolved ? "Y" : "N"}</li>
      </ul>
    </div>
  );
};

export default Mission;
