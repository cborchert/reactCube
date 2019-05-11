const COLORS = {
  y: "yellow",
  b: "blue",
  r: "red",
  o: "orange",
  g: "green",
  w: "white",
  x: "gray",
  _: "transparent"
};

// using cube.js order
const FACES = ["U", "R", "F", "D", "L", "B"];

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

// URFDLB
// const BLOCK_COLORS = [
//   {
//     faceColors: ["w", "_", "_", "_", "b", "r"]
//   },
//   {
//     faceColors: ["w", "_", "_", "_", "_", "r"]
//   },
//   {
//     faceColors: ["w", "g", "_", "_", "_", "r"]
//   },

//   {
//     faceColors: ["w", "_", "_", "_", "b", "_"]
//   },
//   {
//     faceColors: ["w", "_", "_", "_", "_", "_"]
//   },
//   {
//     faceColors: ["w", "g", "_", "_", "_", "_"]
//   },

//   {
//     faceColors: ["w", "_", "o", "_", "b", "_"]
//   },
//   {
//     faceColors: ["w", "_", "o", "_", "_", "_"]
//   },
//   {
//     faceColors: ["w", "g", "o", "_", "_", "_"]
//   },

//   {
//     faceColors: ["_", "_", "_", "_", "b", "r"]
//   },
//   {
//     faceColors: ["_", "_", "_", "_", "_", "r"]
//   },
//   {
//     faceColors: ["_", "g", "_", "_", "_", "r"]
//   },

//   {
//     faceColors: ["_", "_", "_", "_", "b", "_"]
//   },
//   {
//     faceColors: ["_", "_", "_", "_", "_", "_"]
//   },
//   {
//     faceColors: ["_", "g", "_", "_", "_", "_"]
//   },

//   {
//     faceColors: ["_", "_", "o", "_", "b", "_"]
//   },
//   {
//     faceColors: ["_", "_", "o", "_", "_", "_"]
//   },
//   {
//     faceColors: ["_", "g", "o", "_", "_", "_"]
//   },

//   {
//     faceColors: ["_", "_", "_", "y", "b", "r"]
//   },
//   {
//     faceColors: ["_", "_", "_", "y", "_", "r"]
//   },
//   {
//     faceColors: ["_", "g", "_", "y", "_", "r"]
//   },

//   {
//     faceColors: ["_", "_", "_", "y", "b", "_"]
//   },
//   {
//     faceColors: ["_", "_", "_", "y", "_", "_"]
//   },
//   {
//     faceColors: ["_", "g", "_", "y", "_", "_"]
//   },

//   {
//     faceColors: ["_", "_", "o", "y", "b", "_"]
//   },
//   {
//     faceColors: ["_", "_", "o", "y", "_", "_"]
//   },
//   {
//     faceColors: ["_", "g", "o", "y", "_", "_"]
//   }
// ];
const BLOCK_COLORS = [
  {
    faceColors: ["w", "_", "_", "_", "o", "b"]
  },
  {
    faceColors: ["w", "_", "_", "_", "_", "b"]
  },
  {
    faceColors: ["w", "r", "_", "_", "_", "b"]
  },

  {
    faceColors: ["w", "_", "_", "_", "o", "_"]
  },
  {
    faceColors: ["w", "_", "_", "_", "_", "_"]
  },
  {
    faceColors: ["w", "r", "_", "_", "_", "_"]
  },

  {
    faceColors: ["w", "_", "g", "_", "o", "_"]
  },
  {
    faceColors: ["w", "_", "g", "_", "_", "_"]
  },
  {
    faceColors: ["w", "r", "g", "_", "_", "_"]
  },

  {
    faceColors: ["_", "_", "_", "_", "o", "b"]
  },
  {
    faceColors: ["_", "_", "_", "_", "_", "b"]
  },
  {
    faceColors: ["_", "r", "_", "_", "_", "b"]
  },

  {
    faceColors: ["_", "_", "_", "_", "o", "_"]
  },
  {
    faceColors: ["_", "_", "_", "_", "_", "_"]
  },
  {
    faceColors: ["_", "r", "_", "_", "_", "_"]
  },

  {
    faceColors: ["_", "_", "g", "_", "o", "_"]
  },
  {
    faceColors: ["_", "_", "g", "_", "_", "_"]
  },
  {
    faceColors: ["_", "r", "g", "_", "_", "_"]
  },

  {
    faceColors: ["_", "_", "_", "y", "o", "b"]
  },
  {
    faceColors: ["_", "_", "_", "y", "_", "b"]
  },
  {
    faceColors: ["_", "r", "_", "y", "_", "b"]
  },

  {
    faceColors: ["_", "_", "_", "y", "o", "_"]
  },
  {
    faceColors: ["_", "_", "_", "y", "_", "_"]
  },
  {
    faceColors: ["_", "r", "_", "y", "_", "_"]
  },

  {
    faceColors: ["_", "_", "g", "y", "o", "_"]
  },
  {
    faceColors: ["_", "_", "g", "y", "_", "_"]
  },
  {
    faceColors: ["_", "r", "g", "y", "_", "_"]
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
  //   swapDirection: true,
  //   axis: "z"
  // },
  // S: {
  //   swapDirection: false,
  //   axis: "z"
  // },
  // B: {
  //   swapDirection: false,
  //   axis: "z"
  // }
  F: {
    swapDirection: false,
    axis: "z"
  },
  S: {
    swapDirection: true,
    axis: "z"
  },
  B: {
    swapDirection: true,
    axis: "z"
  }
};

const DEFAULT_BLOCKS = BLOCK_COLORS.map((blockColors, i) => {
  return {
    ...blockColors,
    initialPosition: i,
    baseTransform: baseTransforms[i],
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  };
});

const BLOCK_MAP = BLOCK_COLORS.map(({ faceColors }) =>
  faceColors
    .map((face, i) => {
      if (face !== "_") {
        return FACES[i];
      } else {
        return null;
      }
    })
    .filter(face => !!face)
);

const FACE_TO_COLOR_MAP = {
  U: "w",
  // R: "g",
  R: "r",
  // F: "o",
  F: "g",
  D: "y",
  // L: "b",
  L: "o",
  // B: "r"
  B: "b"
};

const COLOR_TO_FACE_MAP = {
  w: "U",
  // g: "R",
  r: "R",
  // o: "F",
  g: "F",
  y: "D",
  // b: "L",
  o: "L",
  // r: "B"
  b: "B"
};

//Mapping of our block positions to those used by cube.js
// UUUUUUUUU RRRRRRRRR FFFFFFFFF DDDDDDDDD LLLLLLLLL BBBBBBBBB
// 000000000 011111111 112222222 222333333 333444444 444445555
// 012345678 901234567 890123456 789012345 678901234 567890123
// URFDLB
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

function giikerStateToCubeState(giikerState) {
  // giikerState is a string like so
  // UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
  let cubeState = [...DEFAULT_BLOCKS];

  if (!giikerState) {
    return cubeState;
  }

  // loop over block positions determine the positions of
  BLOCK_POSITIONS.forEach((block, i) => {
    block.forEach((faceIndex, j) => {
      // map giiker's faces to the the cubeState's face colors
      cubeState[i].faceColors[j] = FACE_TO_COLOR_MAP[giikerState[faceIndex]];
    });
  });

  return cubeState;
}

export {
  COLORS,
  FACES,
  BLOCK_COLORS,
  BLOCK_POSITIONS,
  FACE_TO_COLOR_MAP,
  COLOR_TO_FACE_MAP,
  BLOCK_MAP,
  TRANSFORMS,
  FACE_DETAILS,
  DEFAULT_BLOCKS,
  baseTransforms,
  faceFilters,
  giikerStateToCubeState
};
