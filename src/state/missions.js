// TODO: Move file
// TODO: Unit tests
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
import { getFaceBlocks, stringStateToCubeState } from "../utils/cubeUtils";

const cubeIsSolved = blocks => isSolved(blocks);
const cubeCrosses = blocks => detectCrosses(blocks);
const cubeFacesSolved = blocks => detectSolvedFaces(blocks);
const bottomOfF2L = blocks => isF2L(blocks);
const topColor = blocks => getOpposite(bottomOfF2L(blocks));
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
  return theTopFace && isFaceSingleColor(theTopFace);
};

const solveCube = {
  title: "Solve the Cube",
  scramble: true,
  countdown: 15,
  canSkipCountdown: true,
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
    { text: "top is plus", check: blocks => topIsPlus(blocks) },
    { text: "top cross", check: topIsCross },
    { text: "top corners", check: topCornersInPosition },
    { text: "isOLL", check: isOll },
    { text: "solved", check: cubeIsSolved }
  ]
};

const solveOLL = {
  title: "Complete the OLL Case",
  countdown: 0,
  canSkipCountdown: true,
  description: null,
  introHTML: null,
  isTraining: true,
  objectives: [
    {
      text: "Antisune",
      /**
       * At beginning of this objective, the following function will be called to set the blocks on the cube
       */
      setBlocks: () =>
        stringStateToCubeState(
          "RUFUUUBUUFRRRRRRRRULLFFFFFFDDDDDDDDDUFLLLLLLLUBBBBBBBB"
        ),
      check: (blocks, title) => title === "Antisune" && isOll(blocks)
    },
    {
      text: "Sune",
      setBlocks: () =>
        stringStateToCubeState(
          "BURUUUUUFLBURRRRRRLLUFFFFFFDDDDDDDDDRRBLLLLLLFFUBBBBBB"
        ),
      check: (blocks, title) => title === "Sune" && isOll(blocks)
    },
    {
      text: "Double Sune",
      setBlocks: () =>
        stringStateToCubeState(
          "BUBUUUFUFLRLRRRRRRUFUFFFFFFDDDDDDDDDRLRLLLLLLUBUBBBBBB"
        ),
      check: (blocks, title) => title === "Double Sune" && isOll(blocks)
    },
    {
      text: "Pi",
      setBlocks: () =>
        stringStateToCubeState(
          "FULUUUBULBFFRRRRRRRRUFFFFFFDDDDDDDDDUBULLLLLLULRBBBBBB"
        ),
      check: (blocks, title) => title === "Pi" && isOll(blocks)
    },
    {
      text: "Bowtie",
      setBlocks: () =>
        stringStateToCubeState(
          "BUUUUUUUBRLLRRRRRRRBUFFFFFFDDDDDDDDDURFLLLLLLFFLBBBBBB"
        ),
      check: (blocks, title) => title === "Bowtie" && isOll(blocks)
    },
    {
      text: "Chameleon",
      setBlocks: () =>
        stringStateToCubeState(
          "LUUUUUFUUBLLRRRRRRUBRFFFFFFDDDDDDDDDBRRLLLLLLFFUBBBBBB"
        ),
      check: (blocks, title) => title === "Chameleon" && isOll(blocks)
    },
    {
      text: "Headlights",
      setBlocks: () =>
        stringStateToCubeState(
          "BUBUUUUUUFRLRRRRRRRFLFFFFFFDDDDDDDDDRLFLLLLLLUBUBBBBBB"
        ),
      check: (blocks, title) => title === "Headlights" && isOll(blocks)
    }
  ]
};

export default [solveCube, solveOLL];
