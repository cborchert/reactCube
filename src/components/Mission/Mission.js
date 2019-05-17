import React from "react";
import { isSolved, hasCross } from "../../utils/missionUtils.js";
import { useCube } from "../../state/CubeContext.js";

const Mission = () => {
  const { blocks } = useCube();
  const isCubeSolved = isSolved(blocks);
  // const cubeHasCross = hasCross(blocks);
  return <div>isSolved: {isCubeSolved ? "Y" : "N"}</div>;
};

export default Mission;
