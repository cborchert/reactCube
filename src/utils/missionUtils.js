import { FACE_NAMES, getFaceBlocks } from "./cubeUtils";

/**
 * Given a cubeState, will determine if solved
 * Note: this function only tells you if all the faces are of a single color
 * @param {array} blocks
 * @returns {boolean} isSolved
 */
export function isSolved(blocks) {
  // For each face name, check that all the blocks have their outward faces of a single color
  return FACE_NAMES.reduce((soFarSoGood, FACE_NAME) => {
    const face = getFaceBlocks(FACE_NAME, blocks);
    return soFarSoGood && isFaceSingleColor(face);
  });
}

/**
 * Given a face, will determine if all the blocks are the same color
 * @param {array} face
 * @returns {boolean}
 */
export function isFaceSingleColor(face) {
  // extract facename and color from the face
  const { faceName, color } = getFaceNameAndColor(face);
  // loop through the blocks on the face, and check if the given faceName has the color
  return face.reduce((isDesiredColor, { faces }) => {
    const blockFaceColor = faces[faceName];
    return isDesiredColor && blockFaceColor === color;
  }, true);
}

/**
 * Given a face, will return the name and color of the face
 * @param {array} face
 * @returns {object}
 */
export function getFaceNameAndColor(face) {
  // Center is always the 5th entry on a 3x3 face
  const center = face[4];
  // Assuming that no other faces have been defined, the first will be the only
  const [faceName, color] = Object.entries(center.faces)[0];
  return { faceName, color };
}

/**
 * Given the blocks, it will detect what faces have crosses
 * @param {array} blocks
 * @returns {array} of facenames that have a cross
 */
export function detectCrosses(blocks) {
  const faces = FACE_NAMES.reduce(
    (theFaces, faceName) => ({
      ...theFaces,
      [faceName]: getFaceBlocks(faceName, blocks)
    }),
    {}
  );
  const crosses = Object.entries(faces).reduce((crosses, [faceName, face]) => {
    // get the face color
    const color = face[4].faces[faceName];
    // get the edges of the face
    const edges = [face[1], face[3], face[5], face[7]];
    // check that the edges of this face all have the same color on the same face as the center
    // and check that those edges have the same color as the center on the adjacent face
    const isCross = edges.reduce((soFarSoGood, edge) => {
      // if we've already failed, just skip it
      if (!soFarSoGood) return false;
      // check against the color of the current face, if it doesn't match, fail
      if (edge.faces[faceName] !== color) return false;
      // check against the color of the adjacent tile
      const adjacentFaceName = Object.keys(edge.faces).find(edgeFaceName => {
        return edgeFaceName !== faceName;
      });
      const faceToMatch = faces[adjacentFaceName];
      const adjacentColor = faceToMatch[4].faces[adjacentFaceName];
      const hasAdjacentColor = edge.faces[adjacentFaceName] === adjacentColor;
      // if it has the ajacent color, then the edge passes the test
      return hasAdjacentColor;
    }, true);
    // create a list of crosses on the cube
    return isCross ? [...crosses, faceName] : crosses;
  }, []);
  return crosses;
}

/**
 * Given a face's blocks, determine if the outer layers are well aligned
 * @param {array} face
 */
export function faceHasExternalBandSolved(face) {
  const faceEdges = [
    // top edge
    { center: face[1], edgeBlocks: [face[0], face[2]] },
    // right edge
    { center: face[5], edgeBlocks: [face[2], face[8]] },
    // bottom edge
    { center: face[7], edgeBlocks: [face[8], face[6]] },
    // left edge
    { center: face[3], edgeBlocks: [face[6], face[0]] }
  ];

  // all the layer edges should align with their centers
  return faceEdges.every(({ center, edgeBlocks }) => {
    const [faceToMatch, centerColor] = Object.entries(center.faces)[0];
    return edgeBlocks.every(block => {
      return block.faces[faceToMatch] === centerColor;
    });
  });
}

// /**
//  * Given the blocks, it will detect what faces have been solved
//  * @param {array} blocks
//  * @returns {array} of facenames that have been solved
//  */
// export function detectSolvedFaces(blocks) {
//   const faces = FACE_NAMES.reduce(
//     (theFaces, faceName) => ({
//       ...theFaces,
//       [faceName]: getFaceBlocks(faceName, blocks)
//     }),
//     {}
//   );
//   const solvedFaces = Object.entries(faces).reduce(
//     (solvedFaces, [faceName, face]) => {
//       // get the face color
//       const centerColor = face[4].faces[faceName];

//       // check that the that all the faces of all the blocks on this layer are well-aligned
//       const isSolved = face.reduce((soFarSoGood, block) => {
//         // if we've already failed, just skip it
//         if (!soFarSoGood) return false;

//         // check against the color of all the faces that the block has
//         const isBlockSolved = Object.entries(block.faces).reduce(
//           (isBlockCorrect, [blockFaceName, blockFaceColor]) => {
//             const faceToMatch = faces[blockFaceName];
//             const adjacentColor = faceToMatch[4].faces[blockFaceName];
//             const hasAdjacentColor = blockFaceColor === adjacentColor;
//             return hasAdjacentColor && isBlockCorrect;
//           },
//           true
//         );

//         // if the block is good and we're good so far, return true
//         return isBlockSolved && soFarSoGood;
//       }, true);
//       // create a list of crosses on the cube
//       return isSolved ? [...solvedFaces, faceName] : solvedFaces;
//     },
//     []
//   );
//   return solvedFaces;
// }

/**
 * Given the blocks, it will detect what faces have been solved
 * @param {array} blocks
 * @returns {array} of facenames that have been solved
 */
export function detectSolvedFaces(blocks) {
  const faces = FACE_NAMES.reduce(
    (theFaces, faceName) => ({
      ...theFaces,
      [faceName]: getFaceBlocks(faceName, blocks)
    }),
    {}
  );
  const solvedFaces = Object.entries(faces).reduce(
    (solvedFaces, [faceName, face]) => {
      // check that the that all the faces of all the blocks on this layer are well-aligned
      const isSolved =
        faceHasExternalBandSolved(face) && isFaceSingleColor(face);
      // create a list of crosses on the cube
      return isSolved ? [...solvedFaces, faceName] : solvedFaces;
    },
    []
  );
  return solvedFaces;
}

// /**
//  * Given the blocks, it will detect what middle faces have been solved
//  * @param {array} blocks
//  * @returns {array} of the middle layers names that have been solved
//  */
// export function detectMiddleSolved(blocks) {
//   // Loop over the middle layers
//   const middles = ["E", "S", "M"];
//   const layers = middles.reduce(
//     (theFaces, faceName) => ({
//       ...theFaces,
//       [faceName]: getFaceBlocks(faceName, blocks)
//     }),
//     {}
//   );
//   const solvedLayers = Object.entries(layers).reduce(
//     (solvedLayers, [layerName, layer]) => {
//       // set up the blocks for the test
//       const layerEdges = [
//         // top edge
//         { center: layer[1], edgeBlocks: [layer[0], layer[2]] },
//         // right edge
//         { center: layer[5], edgeBlocks: [layer[2], layer[8]] },
//         // bottom edge
//         { center: layer[7], edgeBlocks: [layer[8], layer[6]] },
//         // left edge
//         { center: layer[3], edgeBlocks: [layer[6], layer[0]] }
//       ];

//       // all the layer edges should align with their centers
//       const layerSolved = layerEdges.every(({ center, edgeBlocks }) => {
//         const [faceToMatch, centerColor] = Object.entries(center.faces)[0];
//         return edgeBlocks.every(block => (block[faceToMatch] = centerColor));
//       });

//       return layerSolved ? [...solvedLayers, layerName] : solvedLayers;
//     },
//     []
//   );
//   return solvedLayers;
// }

/**
 * Given the blocks, it will detect what middle faces have been solved
 * @param {array} blocks
 * @returns {array} of the middle layers names that have been solved
 */
export function detectMiddleSolved(blocks) {
  const middles = ["E", "S", "M"];
  const layers = middles.reduce(
    (theFaces, faceName) => ({
      ...theFaces,
      [faceName]: getFaceBlocks(faceName, blocks)
    }),
    {}
  );
  const solvedLayers = Object.entries(layers).reduce(
    (solvedLayers, [layerName, layer]) => {
      const layerSolved = faceHasExternalBandSolved(layer);
      return layerSolved ? [...solvedLayers, layerName] : solvedLayers;
    },
    []
  );
  return solvedLayers;
}

/**
 * Given the faces with crosses and middle layers solved, determine the bottom face if the cube is f2l
 * otherwise return null
 * @param {array} facesSolved name of faces that are solved
 * @param {array} middleLayersSolved name of middle layers that have crosses
 * @returns {string} the name of the bottom face
 */
export function isF2L(blocks) {
  // Take only faces that are completely solved and aligned (in a cross state)
  // These are our potential bottom layers of F2L
  const facesWithCrosses = detectCrosses(blocks);
  const cubeFacesSolved = detectSolvedFaces(blocks);
  const middleLayersSolved = detectMiddleSolved(blocks);
  const solvedCrosses = facesWithCrosses.filter(
    faceName => cubeFacesSolved.indexOf(faceName) > -1
  );

  // Returns the bottom layer "D" of solved state
  let D;

  // Go through the solved crosses and return the first which matches: with the corresponding middle layer solved.

  //D + E
  //U + E
  if (
    (D = solvedCrosses.find(
      faceName => faceName === "D" || faceName === "U"
    )) &&
    middleLayersSolved.includes("E")
  ) {
    return D;
  }
  //F + S
  //B + S
  if (
    (D = solvedCrosses.find(
      faceName => faceName === "F" || faceName === "B"
    )) &&
    middleLayersSolved.includes("S")
  ) {
    return D;
  }
  //L + M
  //R + M
  if (
    (D = solvedCrosses.find(
      faceName => faceName === "L" || faceName === "R"
    )) &&
    middleLayersSolved.includes("M")
  ) {
    return D;
  }
  return null;
}

export function getOpposite(faceName) {
  const opposites = {
    F: "B",
    B: "F",
    U: "D",
    D: "U",
    R: "L",
    L: "R"
  };
  return opposites[faceName];
}

//blocks
//beginner method
export function isFacePlus(face) {
  const { faceName, color } = getFaceNameAndColor(face);
  return (
    face[1].faces[faceName] === color &&
    face[3].faces[faceName] === color &&
    face[5].faces[faceName] === color &&
    face[7].faces[faceName] === color
  );
}

//blocks
//beginner method
// export function areCornersInPosition(face) {
//   //TODO Needs work
//   const { faceName, color } = getFaceNameAndColor(face);
//   console.log(face, faceName, color);
//   // for each corner (blocks 0, 2, 6, 8), get list of facenames
//   // get colors of each facename
//   //
//   return (
//     Object.values(face[0].faces).includes(color) &&
//     Object.values(face[2].faces).includes(color) &&
//     Object.values(face[6].faces).includes(color) &&
//     Object.values(face[8].faces).includes(color)
//   );
// }
export function areCornersInPosition(faceName, blocks) {
  // console.log("areCornersInPosition? investigating face: ", faceName);
  const faces = {
    U: getFaceBlocks("U", blocks),
    D: getFaceBlocks("D", blocks),
    L: getFaceBlocks("L", blocks),
    R: getFaceBlocks("R", blocks),
    B: getFaceBlocks("B", blocks),
    F: getFaceBlocks("F", blocks)
  };
  const faceColors = {
    U: getFaceNameAndColor(faces["U"])["color"],
    D: getFaceNameAndColor(faces["D"])["color"],
    L: getFaceNameAndColor(faces["L"])["color"],
    R: getFaceNameAndColor(faces["R"])["color"],
    F: getFaceNameAndColor(faces["F"])["color"],
    B: getFaceNameAndColor(faces["B"])["color"]
  };
  const face = faces[faceName];
  // for each corner (blocks 0, 2, 6, 8),
  //   - get the sticker colors on corner
  //   - get the corner's facenames
  //   - get the facenames colors
  //   - check that the facename colors and the sticker colors match
  const cornerBlockIndices = [0, 2, 6, 8];
  const cornerBlocks = cornerBlockIndices.map(v => face[v]);
  return cornerBlocks.every(({ faces }) => {
    const cornerFaceNames = Object.keys(faces);
    const expectedFaceColors = cornerFaceNames.map(name => faceColors[name]);
    const cornerFaceColors = Object.values(faces);
    // console.log("cornerFaceColors, expectedFaceColors");
    // console.log(cornerFaceColors, expectedFaceColors);
    return expectedFaceColors.every(color => cornerFaceColors.includes(color));
  });
}

//blocks
//check is F2L and opposite is solid
export function isPLL() {}

//blocks
//check is F2L and opposite is corner solved (not cross)
export function isOLL() {}
