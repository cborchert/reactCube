import {
  isSolved,
  detectCrosses,
  detectSolvedFaces,
  isF2L,
  isFacePlus,
  getOpposite,
  areCornersInPosition,
  isFaceSingleColor
} from "../utils/missionUtils";
import { getFaceBlocks } from "../utils/cubeUtils";

const cubeIsSolved = blocks => isSolved(blocks);
const cubeCrosses = blocks => detectCrosses(blocks);
const cubeFacesSolved = blocks => detectSolvedFaces(blocks);
const bottomOfF2L = blocks => isF2L(blocks);
const topColor = blocks => getOpposite(bottomOfF2L);
const topFace = blocks => {
  const theTopColor = topColor(blocks);
  return theTopColor && getFaceBlocks(theTopColor, blocks);
};
const topIsPlus = blocks => {
  const theTopFace = topFace(blocks);
  return bottomOfF2L(blocks) && theTopFace && isFacePlus(theTopFace);
};
const topIsCross = blocks => {
  const theTopColor = topColor(blocks);
  const theCubeCrosses = cubeCrosses(blocks);
  return theTopColor && theCubeCrosses && theCubeCrosses.includes(theTopColor);
};
const topCornersInPosition = blocks => {
  const theTopColor = topColor(blocks);
  return theTopColor && areCornersInPosition(theTopColor, blocks);
};
const isOll = blocks => {
  const theTopFace = topFace(blocks);
  const areTopCornersInPosition = topCornersInPosition(blocks);
  return areTopCornersInPosition && isFaceSingleColor(theTopFace);
};

const solveCube = {
  title: "Solve the Cube",
  scramble: true,
  countdown: 15,
  description: null,
  introHTML: null,
  objectives: [
    {
      text: "bottom cross",
      check: blocks => {
        const crosses = cubeCrosses(blocks);
        return crosses && crosses.length > 0;
      }
    },
    {
      text: "bottom solved",
      check: blocks => {
        const facesSolved = cubeFacesSolved(blocks);
        return facesSolved && facesSolved.length > 0;
      }
    },
    {
      text: "first 2 layers",
      check: blocks => {
        const bottomFace = bottomOfF2L(blocks);
        return bottomFace && bottomFace.length > 0;
      }
    },
    { text: "top is plus", check: topIsPlus },
    { text: "top cross", check: topIsCross },
    { text: "top corners", check: topCornersInPosition },
    { text: "isOLL", check: isOll },
    { text: "solved", check: cubeIsSolved }
  ]
};

export default [solveCube];
