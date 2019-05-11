import React from "react";
import {
  faceFilters,
  baseTransforms,
  DEFAULT_BLOCKS,
  FACE_DETAILS,
  TRANSFORMS
} from "../utils/cubeUtils.js";

function getFace(faceName, blocks) {
  const filter = faceFilters[faceName];
  if (!filter) return [];
  return blocks.filter((block, i) => filter(i));
}

function applyTransformsToFace(face, faceTransform, blockTransform, turns) {
  if (turns > 0) {
    // mutate face colors
    const a = face.map(block => {
      return {
        ...block,
        faceColors: applyTransform(block.faceColors, blockTransform)
      };
    });
    // mutate blocks
    const b = applyTransform(a, faceTransform);
    return applyTransformsToFace(b, faceTransform, blockTransform, turns - 1);
  }
  return face;
}

function applyTransform(array, transform) {
  if (array.length !== transform.length) {
    return array;
  }
  const mod = array.map((a, i) => array[transform[i]]);
  return mod;
}

function applyFaceToCube(face, faceName, blocks) {
  let counter = 0;
  const isBlockOnRequestedFace = faceFilters[faceName];
  if (!isBlockOnRequestedFace) {
    return blocks;
  }
  return blocks.map((block, i) => {
    if (isBlockOnRequestedFace(i)) {
      const theBlock = face[counter];
      counter++;
      return theBlock;
    }
    return block;
  });
}

function parseTurnString(turnString) {
  const faceName = turnString[0].toUpperCase();
  const numTurnRegexMatches = turnString.match(/\d+/g);
  const turns =
    numTurnRegexMatches && numTurnRegexMatches.length > 0
      ? numTurnRegexMatches[0]
      : 1;
  const direction = turnString.indexOf("'") > -1 ? -1 : 1;
  return {
    faceName,
    turns: turns * direction
  };
}

function applyTurnToCube(turnString, blocks) {
  const { faceName, turns } = parseTurnString(turnString);
  if (turns === 0) {
    return blocks;
  }
  const face = getFace(faceName, blocks);
  const faceDetails = FACE_DETAILS[faceName];
  // in case we need to swap
  const trueTurns = faceDetails.swapDirection ? turns * -1 : turns;
  const direction = trueTurns > 0 ? "+" : "-";
  const axis = faceDetails.axis;
  const faceTransform = TRANSFORMS.face[direction];
  const blockTransform = TRANSFORMS.block[axis][direction];
  const rotatedFace = applyTransformsToFace(
    face,
    faceTransform,
    blockTransform,
    Math.abs(turns)
  );
  const appliedCube = applyFaceToCube(rotatedFace, faceName, blocks);
  return appliedCube.map((block, i) => ({
    ...block,
    baseTransform: baseTransforms[i],
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  }));
}

function applyRotationAnimationToCube(turnString, blocks) {
  const { faceName, turns } = parseTurnString(turnString);
  if (turns === 0) {
    return blocks;
  }
  const face = getFace(faceName, blocks);
  const faceDetails = FACE_DETAILS[faceName];
  // in case we need to swap const
  let trueTurns = faceDetails.swapDirection ? turns : turns * -1;
  const axis = faceDetails.axis;
  if (axis === "z") {
    //TODO: Honestly there's something messed up with the way I did the transforms...
    trueTurns = trueTurns * -1;
  }
  const propertyName = `rotate${axis.toUpperCase()}`;
  const rotation = `${90 * trueTurns}`;
  const rotatedFace = face.map(block => ({
    ...block,
    [propertyName]: rotation
  }));
  const appliedCube = applyFaceToCube(rotatedFace, faceName, blocks);
  return appliedCube;
}

let timeout = null;

const CubeContext = React.createContext();

function CubeProvider(props) {
  const [blocks, setBlocks] = React.useState(DEFAULT_BLOCKS);
  const [animatingBlocks, setAnimatingBlocks] = React.useState(null);
  const value = React.useMemo(() => {
    return {
      blocks,
      setBlocks,
      animatingBlocks,
      setAnimatingBlocks
    };
  }, [blocks, animatingBlocks]);
  return <CubeContext.Provider value={value} {...props} />;
}

function useCube() {
  const context = React.useContext(CubeContext);
  if (!context) {
    throw new Error("useCube must be used within a CubeProvider");
  }
  const { blocks, setBlocks, animatingBlocks, setAnimatingBlocks } = context;
  // todo allow control of this
  const animationSpeed = 120;
  return {
    blocks: animatingBlocks ? animatingBlocks : blocks,
    animationSpeed: animatingBlocks ? animationSpeed : 0,
    turnCube: turnString => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      setAnimatingBlocks(applyRotationAnimationToCube(turnString, blocks));
      setBlocks(applyTurnToCube(turnString, blocks));
      timeout = setTimeout(() => {
        setAnimatingBlocks(null);
        timeout = null;
      }, animationSpeed);
    },
    setCubeState: (cubeState, turnString) => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      if (turnString) {
        setAnimatingBlocks(applyRotationAnimationToCube(turnString, blocks));
        timeout = setTimeout(() => {
          setAnimatingBlocks(null);
          timeout = null;
        }, animationSpeed);
      }
      setBlocks(cubeState);
    }
  };
}

export { CubeProvider, useCube };
