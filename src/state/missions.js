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
const isPll1 = blocks => {
  return isOll(blocks) && topCornersInPosition(blocks);
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

const solveOLLPLL = {
  title: "Complete the OLL/PLL Case",
  countdown: 0,
  canSkipCountdown: true,
  description: null,
  introHTML: null,
  isTraining: true,
  objectives: [
    {
      text: "OLL: Antisune",
      /**
       * At beginning of this objective, the following function will be called to set the blocks on the cube
       */
      setBlocks: () =>
        stringStateToCubeState(
          "RUFUUUBUUFRRRRRRRRULLFFFFFFDDDDDDDDDUFLLLLLLLUBBBBBBBB"
        ),
      check: (blocks, title) =>
        title === "OLL: Antisune" && cubeIsSolved(blocks)
    },
    {
      text: "OLL: Sune",
      setBlocks: () =>
        stringStateToCubeState(
          "BURUUUUUFLBURRRRRRLLUFFFFFFDDDDDDDDDRRBLLLLLLFFUBBBBBB"
        ),
      check: (blocks, title) => title === "OLL: Sune" && isOll(blocks)
    },
    {
      text: "OLL: Double Sune",
      setBlocks: () =>
        stringStateToCubeState(
          "BUBUUUFUFLRLRRRRRRUFUFFFFFFDDDDDDDDDRLRLLLLLLUBUBBBBBB"
        ),
      check: (blocks, title) => title === "OLL: Double Sune" && isOll(blocks)
    },
    {
      text: "OLL: Pi",
      setBlocks: () =>
        stringStateToCubeState(
          "FULUUUBULBFFRRRRRRRRUFFFFFFDDDDDDDDDUBULLLLLLULRBBBBBB"
        ),
      check: (blocks, title) => title === "OLL: Pi" && isOll(blocks)
    },
    {
      text: "OLL: Bowtie",
      setBlocks: () =>
        stringStateToCubeState(
          "BUUUUUUUBRLLRRRRRRRBUFFFFFFDDDDDDDDDURFLLLLLLFFLBBBBBB"
        ),
      check: (blocks, title) => title === "OLL: Bowtie" && isOll(blocks)
    },
    {
      text: "OLL: Chameleon",
      setBlocks: () =>
        stringStateToCubeState(
          "LUUUUUFUUBLLRRRRRRUBRFFFFFFDDDDDDDDDBRRLLLLLLFFUBBBBBB"
        ),
      check: (blocks, title) => title === "OLL: Chameleon" && isOll(blocks)
    },
    {
      text: "OLL: Headlights",
      setBlocks: () =>
        stringStateToCubeState(
          "BUBUUUUUUFRLRRRRRRRFLFFFFFFDDDDDDDDDRLFLLLLLLUBUBBBBBB"
        ),
      check: (blocks, title) => title === "OLL: Headlights" && isOll(blocks)
    },
    {
      text: "PLL1: T-Perm",
      setBlocks: () =>
        stringStateToCubeState(
          "UUUUUUUUUBLFRRRRRRFFRFFFFFFDDDDDDDDDLRLLLLLLLRBBBBBBBB"
        ),
      check: (blocks, title) => title === "PLL1: T-Perm" && isPll1(blocks)
    },
    {
      text: "PLL1: Y-Perm",
      setBlocks: () =>
        stringStateToCubeState(
          "UUUUUUUUULRRRRRRRRFFBFFFFFFDDDDDDDDDRBLLLLLLLBLFBBBBBB"
        ),
      check: (blocks, title) => title === "PLL1: Y-Perm" && isPll1(blocks)
    },
    {
      text: "PLL2: H-Perm",
      setBlocks: () =>
        stringStateToCubeState(
          "UUUUUUUUURLRRRRRRRFBFFFFFFFDDDDDDDDDLRLLLLLLLBFBBBBBBB"
        ),
      check: (blocks, title) => title === "PLL2: H-Perm" && cubeIsSolved(blocks)
    },
    {
      text: "PLL2: U-Perm A",
      setBlocks: () =>
        stringStateToCubeState(
          "UUUUUUUUURLRRRRRRRFRFFFFFFFDDDDDDDDDLFLLLLLLLBBBBBBBBB"
        ),
      check: (blocks, title) =>
        title === "PLL2: U-Perm A" && cubeIsSolved(blocks)
    },
    {
      text: "PLL2: U-Perm B",
      setBlocks: () =>
        stringStateToCubeState(
          "UUUUUUUUURRRRRRRRRFLFFFFFFFDDDDDDDDDLBLLLLLLLBFBBBBBBB"
        ),
      check: (blocks, title) =>
        title === "PLL2: U-Perm B" && cubeIsSolved(blocks)
    },
    {
      text: "PLL2: Z-Perm",
      setBlocks: () =>
        stringStateToCubeState(
          "UUUUUUUUURBRRRRRRRFLFFFFFFFDDDDDDDDDLFLLLLLLLBRBBBBBBB"
        ),
      check: (blocks, title) => title === "PLL2: Z-Perm" && cubeIsSolved(blocks)
    }
  ]
};

export default [solveCube, solveOLLPLL];
