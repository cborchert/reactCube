import React from "react";
import { faceFilters } from "../utils/cubeUtils.js";

const TRANSFORMS = {
  face: {
    //RUF
    "+": [6, 3, 0, 7, 4, 1, 8, 5, 2],
    //LMEDSB
    "-": [2, 5, 8, 1, 4, 7, 0, 3, 6]
  },
  //Reminders: "U", "R", "F", "D", "L", "B"
  block: {
    // for turns on the LMR plane
    x: {
      //R
      "+": [5, 1, 0, 2, 4, 3],
      //LM
      "-": [2, 1, 3, 5, 4, 0]
    },
    // for turns on the UED plane
    y: {
      //U
      "+": [0, 5, 1, 3, 2, 4],
      //ED
      "-": [0, 2, 4, 3, 5, 1]
    },
    // for turns on the FSB plane
    z: {
      //F
      "+": [4, 0, 2, 1, 3, 5],
      //SB
      "-": [1, 3, 2, 4, 0, 5]
    }
  }
};

const FACE_DETAILS = {
  R: {
    swapDirection: true,
    axis: "x"
  },
  L: {
    swapDirection: false,
    axis: "x"
  },
  M: {
    swapDirection: false,
    axis: "x"
  },
  U: {
    swapDirection: false,
    axis: "y"
  },
  E: {
    swapDirection: true,
    axis: "y"
  },
  D: {
    swapDirection: true,
    axis: "y"
  },
  // F: {
  //   swapDirection: false,
  //   axis: "z"
  // },
  // S: {
  //   swapDirection: true,
  //   axis: "z"
  // },
  // B: {
  //   swapDirection: true,
  //   axis: "z"
  // }
  F: {
    swapDirection: true,
    axis: "z"
  },
  S: {
    swapDirection: false,
    axis: "z"
  },
  B: {
    swapDirection: false,
    axis: "z"
  }
};

const BLOCK_COLORS = [
  {
    faceColors: ["y", "_", "_", "_", "g", "r"]
  },
  {
    faceColors: ["y", "_", "_", "_", "_", "r"]
  },
  {
    faceColors: ["y", "b", "_", "_", "_", "r"]
  },

  {
    faceColors: ["y", "_", "_", "_", "g", "_"]
  },
  {
    faceColors: ["y", "_", "_", "_", "_", "_"]
  },
  {
    faceColors: ["y", "b", "_", "_", "_", "_"]
  },

  {
    faceColors: ["y", "_", "o", "_", "g", "_"]
  },
  {
    faceColors: ["y", "_", "o", "_", "_", "_"]
  },
  {
    faceColors: ["y", "b", "o", "_", "_", "_"]
  },

  {
    faceColors: ["_", "_", "_", "_", "g", "r"]
  },
  {
    faceColors: ["_", "_", "_", "_", "_", "r"]
  },
  {
    faceColors: ["_", "b", "_", "_", "_", "r"]
  },

  {
    faceColors: ["_", "_", "_", "_", "g", "_"]
  },
  {
    faceColors: ["_", "_", "_", "_", "_", "_"]
  },
  {
    faceColors: ["_", "b", "_", "_", "_", "_"]
  },

  {
    faceColors: ["_", "_", "o", "_", "g", "_"]
  },
  {
    faceColors: ["_", "_", "o", "_", "_", "_"]
  },
  {
    faceColors: ["_", "b", "o", "_", "_", "_"]
  },

  {
    faceColors: ["_", "_", "_", "w", "g", "r"]
  },
  {
    faceColors: ["_", "_", "_", "w", "_", "r"]
  },
  {
    faceColors: ["_", "b", "_", "w", "_", "r"]
  },

  {
    faceColors: ["_", "_", "_", "w", "g", "_"]
  },
  {
    faceColors: ["_", "_", "_", "w", "_", "_"]
  },
  {
    faceColors: ["_", "b", "_", "w", "_", "_"]
  },

  {
    faceColors: ["_", "_", "o", "w", "g", "_"]
  },
  {
    faceColors: ["_", "_", "o", "w", "_", "_"]
  },
  {
    faceColors: ["_", "b", "o", "w", "_", "_"]
  }
];

let baseTransforms = [];
for (let y = -1; y <= 1; y++) {
  for (let z = -1; z <= 1; z++) {
    for (let x = -1; x <= 1; x++) {
      baseTransforms.push(
        `translateZ(${z}em) translateX(${x}em) translateY(${y}em)`
      );
    }
  }
}

const BLOCKS = BLOCK_COLORS.map((blockColors, i) => {
  return {
    ...blockColors,
    initialPosition: i,
    baseTransform: baseTransforms[i],
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  };
});

const CubeContext = React.createContext();

function CubeProvider(props) {
  const [blocks, setBlocks] = React.useState(BLOCKS);
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
  console.log(array, transform);
  if (array.length !== transform.length) {
    return array;
  }
  const mod = array.map((a, i) => array[transform[i]]);
  console.log(mod);
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
    }
  };
}

export { CubeProvider, useCube };
