/**
 * Note on the block indexes and coordinates
 *
 * Each block represents a single physical block on the rubik's cube and is given an index.
 * The indices of the blocks starts at 0 and goes to 26.
 * Index 0 represents the back left hand corner of the upper face. We then proceed along the row, just until the end (2), then wrap around to the next column on the same face.
 * Once we finish the top layer with i = 8 (front right cube on the upper face), we continue move down to the mid layer, etc.
 *
 * So:
 *
 * back
 * 0 1 2 \
 * 3 4 5  } Upper face/layer
 * 6 7 8 /
 * front
 *
 * back
 * 9  10 11 \
 * 12 13 14  } Middle layer
 * 15 16 17 /
 * front
 *
 * back
 * 18 19 20 \
 * 21 12 23  } Bottom layer
 * 24 25 26 /
 * front
 *
 * Concerning the coordinates, we're using the CSS system, where
 *  - x is the horizontal value, with positive values towards the right
 *  - y is the vertical value, with positive values towards the bottom
 *  - z is the depth value, with positive values coming out of the screen
 *
 *    z-  y-
 *     \  |
 *      \ |
 *       \|
 * -x ____0__________ x+
 *        |\
 *        | \
 *        |  \
 *        |   \
 *        y+   z+
 *
 */

export const COLORS = {
  y: "yellow",
  b: "blue",
  r: "red",
  o: "orange",
  g: "green",
  w: "white",
  x: "gray",
  _: "transparent"
};

// cube.js face name order
export const FACE_NAMES = ["U", "R", "F", "D", "L", "B"];

const FACE_TO_COLOR_MAP = {
  U: "w",
  R: "r",
  F: "g",
  D: "y",
  L: "o",
  B: "b"
};

/**
 * The block actions by face. The indices here are the same as the numbering of blocks.
 * Clicking on the given face of the given block will result in the given turn action.
 */
const BLOCK_CLICK_ACTIONS = [
  { U: "L'", L: "U", B: "U'" },
  { U: "M'", B: "M" },
  { U: "R", R: "U'", B: "U" },

  { U: "S", L: "S'" },
  { U: "U" },
  { U: "S'", R: "S" },

  { U: "L", F: "U", L: "U'" },
  { U: "M", F: "M'" },
  { U: "R'", R: "U", F: "U'" },

  { L: "E'", B: "E" },
  { B: "B" },
  { R: "E", B: "E'" },

  { L: "L" },
  {},
  { R: "R" },

  { F: "E'", L: "E" },
  { F: "F" },
  { R: "E'", F: "E" },

  { D: "L", L: "D'", B: "D" },
  { D: "M", B: "M'" },
  { R: "D", D: "R'", B: "D'" },

  { D: "S'", L: "S" },
  { D: "D" },
  { R: "S'", D: "S" },

  { F: "D'", D: "L'", L: "D" },
  { F: "M", D: "M'" },
  { R: "D'", F: "D", D: "R" }
];

/**
 * Each property is a filter that, given the block index will return true or false to determine if the block is on that face
 */
const faceFilters = {
  U: i => i / 9 < 1,
  E: i => i / 9 >= 1 && i / 9 < 2,
  D: i => i / 9 >= 2,
  L: i => i % 3 === 0,
  M: i => i % 3 === 1,
  R: i => i % 3 === 2,
  F: i => (i % 9) / 6 >= 1,
  S: i => (i % 9) / 3 >= 1 && (i % 9) / 3 < 2,
  B: i => i % 9 <= 2
};

/**
 * Given a facename U|D|R|L|F|B|S|E|M, get all blocks on that face
 * @param {string} faceName
 * @param {array} blocks
 */
export function getFaceBlocks(faceName, blocks) {
  const filter = faceFilters[faceName];
  if (!filter) return [];
  return blocks.filter((block, i) => filter(i));
}

/**
 * Build the initial blocks array
 */
export const getInitialBlocks = () =>
  Array.from({ length: 27 }).map((item, i) => {
    // TODO: The code in this function overlaps functionality defined elsewhere, for example: we could use faceFilters to determine which faces
    // Determine the position of the block
    const x = (i % 3) - 1;
    const z = (Math.floor(i / 3) % 3) - 1;
    const y = Math.floor(i / 9) - 1;

    // Determine the base transforms for the block
    const baseTransform = `translateZ(${z}em) translateX(${x}em) translateY(${y}em)`;

    // Determine the faces for the block
    const whichFaces = [];
    if (x === -1) whichFaces.push("L");
    if (x === 1) whichFaces.push("R");
    if (y === -1) whichFaces.push("U");
    if (y === 1) whichFaces.push("D");
    if (z === -1) whichFaces.push("B");
    if (z === 1) whichFaces.push("F");
    const faces = {};
    whichFaces.forEach(faceName => {
      faces[faceName] = FACE_TO_COLOR_MAP[faceName];
    });

    return {
      faces,
      baseTransform,
      initialPosition: i,
      initialFaces: whichFaces,
      faceActions: { ...BLOCK_CLICK_ACTIONS[i] },
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0
    };
  });

/**
 * Define the face transforms per block, depending on the axis of rotation.
 * The axis of rotation here is as follows:
 * x: rotation of LMR faces (i.e. layers which share the x values from above)
 * y: rotation of UED faces (i.e. layers which share the y values from above)
 * z: rotation of FSB faces (i.e. layers which share the z values from above)
 *
 * Each property tells the mapping of the new object.
 * For example if transform.U = "F", that means that the
 * transform({U:"G", F:"O"}) should return an object such that obj.U === "O"
 * i.e. The NEW "U" face takes its value from the OLD "F" face...
 */

/**
 * Inverses the keys and the values of an object
 * @param {*} obj the original object returning the transform
 * @returns the inversed object
 */
export const inv = obj => {
  const inversed = {};
  const pairs = Object.entries(obj);
  pairs.forEach(([key, val], i) => {
    inversed[val] = key;
  });
  return inversed;
};

// rotation LMR (clockwise per layer)
// transform map describes rotation for R. L and S are inversed
const block_face_transforms_x = {
  U: "F",
  B: "U",
  D: "B",
  F: "D",
  R: "R",
  L: "L"
};
const block_face_transforms_x_inv = inv(block_face_transforms_x);

// rotation UED (clockwise per layer)
// transform map describes rotation for U. E and M are inversed
const block_face_transforms_y = {
  L: "F",
  B: "L",
  R: "B",
  F: "R",
  U: "U",
  D: "D"
};
const block_face_transforms_y_inv = inv(block_face_transforms_y);

// rotation FSB (left to right)
// transform map describes rotation for F. S and B are inversed
const block_face_transforms_z = {
  U: "L",
  R: "U",
  D: "R",
  L: "D",
  F: "F",
  B: "B"
};
const block_face_transforms_z_inv = inv(block_face_transforms_z);

// rotation of the blocks as a face is turned clockwise
// note that clockwise is defined as though you were looking at the face from the F, L (and therefore S), or U...
// therefore the transform will need to be inverted for all other faces
const face_block_transforms_cw = {
  0: "6",
  1: "3",
  2: "0",
  3: "7",
  4: "4",
  5: "1",
  6: "8",
  7: "5",
  8: "2"
};
const face_block_transforms_inv = inv(face_block_transforms_cw);

// Map the transforms needed for a given movement
// NOTE that L and M use inversed movements for the block orientation rotations (as expected), but have the NORMAL transform for the face rotation
// therefore, th R face is inversed for the face rotation, which might strike certain people as strange
// This can be explained by the fact that, according to our block indexing system the R face is "mirrored" in the same way as the D face is.
// What I mean is that if you use the block indices mentioned at the beginning of this file and map them to the R side as if you looked at it straight on,
// you'd get (excuse the crude ASCII diagram):
//
//   ____ ____ ____
//  | \____\____\_0__\
//  |  \____\_UP_\_1__\
//  | F \____\____\_2__\
//  | R |  8 | 5  | 2  |   B
//  | O  ---- ---- ----    A
//  | N | 17 | 14 | 11 |   C
//   \T  ---- ---- ----    K
//    \ | 26 | 23 | 20 |
//     \ ---- ---- ----

const MOVE_TRANSFORMS = {
  U: {
    faceTransform: face_block_transforms_cw,
    blockTransform: block_face_transforms_y,
    cssTransform: {
      axis: "y",
      direction: -1
    }
  },
  E: {
    faceTransform: face_block_transforms_inv,
    blockTransform: block_face_transforms_y_inv,
    cssTransform: {
      axis: "y",
      direction: 1
    }
  },
  D: {
    faceTransform: face_block_transforms_inv,
    blockTransform: block_face_transforms_y_inv,
    cssTransform: {
      axis: "y",
      direction: 1
    }
  },

  L: {
    faceTransform: face_block_transforms_cw,
    blockTransform: block_face_transforms_x_inv,
    cssTransform: {
      axis: "x",
      direction: -1
    }
  },
  M: {
    faceTransform: face_block_transforms_cw,
    blockTransform: block_face_transforms_x_inv,
    cssTransform: {
      axis: "x",
      direction: -1
    }
  },
  R: {
    faceTransform: face_block_transforms_inv,
    blockTransform: block_face_transforms_x,
    cssTransform: {
      axis: "x",
      direction: 1
    }
  },

  F: {
    faceTransform: face_block_transforms_cw,
    blockTransform: block_face_transforms_z,
    cssTransform: {
      axis: "z",
      direction: 1
    }
  },
  S: {
    faceTransform: face_block_transforms_inv,
    blockTransform: block_face_transforms_z_inv,
    cssTransform: {
      axis: "z",
      direction: -1
    }
  },
  B: {
    faceTransform: face_block_transforms_inv,
    blockTransform: block_face_transforms_z_inv,
    cssTransform: {
      axis: "z",
      direction: -1
    }
  }
};

/**
 * Given a single move string like U or R' or B2', returns an object containing the facename and the number of times to turn it
 * @param {string} turnString
 * @returns {object} representing what face to turn and how many times
 */
export function parseTurnString(turnString) {
  // Get and test the face name
  const faceNames = turnString.match(/[URFDLBESM]+/g);

  // if facename doesn't work for us, return null
  if (!faceNames || faceNames.length !== 1) return null;

  const faceName = faceNames[0];
  // TODO: Add lower case turns

  // get the number of turns
  const numTurnRegexMatches = turnString.match(/\d+/g);
  const turns =
    numTurnRegexMatches && numTurnRegexMatches.length > 0
      ? numTurnRegexMatches[0]
      : 1;

  // if a prime ' is present, we'll inverse the number of turns
  const direction = turnString.indexOf("'") > -1 ? -1 : 1;

  return {
    faceName,
    turns: turns * direction
  };
}

/**
 * Apply the given faceTransform to rotate the block positions along the face and the given blockTransform to orient the individual blocks on the face, turns times
 *
 * @param {array} face
 * @param {object} faceTransform
 * @param {object} blockTransform
 * @param {integer} turns
 */
export function applyTransformsToFace(
  face,
  faceTransform,
  blockTransform,
  turns
) {
  // deal with inversions
  const shouldInverse = turns < 0;
  const realFaceTransform = shouldInverse ? inv(faceTransform) : faceTransform;
  const realBlockTransform = shouldInverse
    ? inv(blockTransform)
    : blockTransform;
  const realTurns = Math.abs(turns);

  if (realTurns > 0) {
    // mutate face colors
    const a = face.map(block => {
      return {
        ...block,
        faces: applyTransform(block.faces, realBlockTransform)
      };
    });
    // mutate blocks
    const b = objectToArray(applyTransform(a, realFaceTransform));
    // repeat while turns > 0
    return applyTransformsToFace(
      b,
      realFaceTransform,
      realBlockTransform,
      realTurns - 1
    );
  }
  return face;
}

/**
 * Given an object and the a transform map object, apply the transform
 * @param {object} obj
 * @param {object} transform
 * @returns the transformed object
 */
export function applyTransform(obj, transform) {
  // check that our keys are correct
  let transformError = false;
  const transformedObj = {};
  // apply transform
  Object.entries(transform).forEach(([a, b]) => {
    if (obj.hasOwnProperty(b)) {
      transformedObj[a] = obj[b];
    }
  });
  return transformError ? { ...obj } : transformedObj;
}

/**
 * Given an object with numeric keys, returns an array
 * @param {object} obj
 * @returns array
 */
function objectToArray(obj) {
  const entries = Object.entries(obj);
  let arr = Array.from({ length: entries.length }).map((a, i) => obj[i]);
  return arr;
}

/**
 * Replaces the cubeState blocks on the given faceName with the new face blocks
 * It's like you popped off an entire cube face and applied the new face instead
 * @param {array} face the given blocks
 * @param {string} faceName the face to apply the blocks to
 * @param {array} blocks the original cube state
 */
export function applyFaceToCube(face, faceName, blocks) {
  let counter = 0;
  // set up the function to determine if a given block index is on a given face
  const isBlockOnRequestedFace = faceFilters[faceName];
  if (!isBlockOnRequestedFace) {
    return blocks;
  }
  // loop through the blocks and apply the new blocks where necessary
  return blocks.map((block, i) => {
    if (isBlockOnRequestedFace(i)) {
      const theReplacementBlock = face[counter];
      counter++;
      return theReplacementBlock;
    }
    return block;
  });
}

/**
 * Given a turnString and the blocks, apply the turn to the blocks
 * @param {string} turnString
 * @param {array} blocks
 * @returns new cube state array
 */
export function applyTurnToCube(turnString, blocks) {
  const move = parseTurnString(turnString);

  // Throw out malformed moves
  if (!move) return blocks;
  const { faceName, turns } = move;
  if (turns === 0 || !faceName) return blocks;

  // Get the blocks and transforms to apply
  const face = getFaceBlocks(faceName, blocks);
  const { faceTransform, blockTransform } = MOVE_TRANSFORMS[faceName];

  const rotatedFace = applyTransformsToFace(
    face,
    faceTransform,
    blockTransform,
    turns
  );

  const appliedCube = applyFaceToCube(rotatedFace, faceName, blocks);

  // apply just the faces and orientations, otherwise keep the original values
  const initState = getInitialBlocks();
  return initState.map((block, i) => ({
    ...block,
    initialPosition: appliedCube[i].initialPosition,
    faces: appliedCube[i].faces
  }));
}

/**
 * Given a sequenceString and the blocks, apply the sequence to the blocks
 * @param {string} sequenceString
 * @param {array} blocks
 * @returns new cube state array
 */
export function applySequenceToCube(sequenceString, blocks) {
  const turnStrings = sequenceString.split(" ");
  turnStrings.forEach(turnString => {
    blocks = applyTurnToCube(turnString, blocks);
  });
  return blocks;
}

// Mapping of our block faces the string used by cube.js
// UUUUUUUUU RRRRRRRRR FFFFFFFFF DDDDDDDDD LLLLLLLLL BBBBBBBBB
const BLOCK_POSITIONS = [
  [0, -1, -1, -1, 36, 47],
  [1, -1, -1, -1, -1, 46],
  [2, 11, -1, -1, -1, 45],
  [3, -1, -1, -1, 37, -1],
  [4, -1, -1, -1, -1, -1],
  [5, 10, -1, -1, -1, -1],
  [6, -1, 18, -1, 38, -1],
  [7, -1, 19, -1, -1, -1],
  [8, 9, 20, -1, -1, -1],

  [-1, -1, -1, -1, 39, 50],
  [-1, -1, -1, -1, -1, 49],
  [-1, 14, -1, -1, -1, 48],
  [-1, -1, -1, -1, 40, -1],
  [-1, -1, -1, -1, -1, -1],
  [-1, 13, -1, -1, -1, -1],
  [-1, -1, 21, -1, 41, -1],
  [-1, -1, 22, -1, -1, -1],
  [-1, 12, 23, -1, -1, -1],

  [-1, -1, -1, 33, 42, 53],
  [-1, -1, -1, 34, -1, 52],
  [-1, 17, -1, 35, -1, 51],
  [-1, -1, -1, 30, 43, -1],
  [-1, -1, -1, 31, -1, -1],
  [-1, 16, -1, 32, -1, -1],
  [-1, -1, 24, 27, 44, -1],
  [-1, -1, 25, 28, -1, -1],
  [-1, 15, 26, 29, -1, -1]
];

/**
 * Give a giiker.js-like string state, return a cube with the correct faces
 * @param {string} stringState
 * @returns {object} cube state
 */
export function stringStateToCubeState(stringState) {
  // cubeState is a string like so
  // UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
  let cubeState = getInitialBlocks();
  const stringValid = /^[URFDLB]+$/.test(stringState);
  if (!stringState || stringState.length !== 54 || !stringValid) {
    return cubeState;
  }

  // loop over block positions determine the positions of
  BLOCK_POSITIONS.forEach((block, i) => {
    block.forEach((faceIndex, j) => {
      // map giiker's faces to the the cubeState's face colors
      cubeState[i].faces[FACE_NAMES[j]] =
        FACE_TO_COLOR_MAP[stringState[faceIndex]];
    });
  });

  return cubeState;
}

/**
 * Rotates the blocks in place without changing state (for css)
 * @param {string} turnString
 * @param {array} blocks the cubeState
 * @returns the new cubeState
 */
export function applyRotationAnimationToCube(turnString, blocks) {
  const move = parseTurnString(turnString);

  // Throw out malformed moves
  if (!move) return blocks;
  const { faceName, turns } = move;
  if (turns === 0 || !faceName) return blocks;

  const face = getFaceBlocks(faceName, blocks);

  // get the details of the transform
  const { axis, direction } = MOVE_TRANSFORMS[faceName].cssTransform;

  const propertyName = `rotate${axis.toUpperCase()}`;
  const rotation = `${90 * direction * turns}`;
  const rotatedFace = face.map(block => ({
    ...block,
    [propertyName]: rotation
  }));
  const appliedCube = applyFaceToCube(rotatedFace, faceName, blocks);
  return appliedCube;
}

/**
 * Create a random algorithm to scramble the cube
 * @param {integer} depth the number of movements to include
 */
function createCubeScramble(depth = 50) {
  let moves = "";
  for (let i = 0; i < depth; i++) {
    const faceName = FACE_NAMES[Math.round(Math.random() * 5)];
    moves += `${faceName} `;
  }
  return moves;
}

/**
 * Create a new cube object with a valid, randomized cube state
 */
export function createScrambledCube() {
  const cubeState = getInitialBlocks();
  const scramble = createCubeScramble();
  return applySequenceToCube(scramble, cubeState);
}
