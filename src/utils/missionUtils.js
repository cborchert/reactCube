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

export function hasCross(blocks) {
  const faces = FACE_NAMES.reduce(
    (theFaces, faceName) => ({
      ...theFaces,
      [faceName]: getFaceBlocks(faceName, blocks)
    }),
    {}
  );
  // console.log(faces);
  Object.entries(faces).forEach(([faceName, face]) => {
    // get the face color
    console.log(`===${faceName}===`);
    const color = face[4].faces[faceName];
    // check that the corners of this face all have the same color
    // i.e. that it has a plus
    const edges = [face[1], face[3], face[5], face[7]];

    const isCross = edges.reduce((soFarSoGood, edge) => {
      console.log("start");
      // if we've failed, just skip it
      if (!soFarSoGood) return false;
      console.log("soFarSoGood");

      // check against the color of the current face, if it doesn't match, fail
      console.log("edge", edge);
      console.log("edge[faceName]", edge.faces[faceName]);
      console.log("color", color);
      if (edge.faces[faceName] !== color) return false;
      console.log("good color");

      // check against the color of the adjacent tile
      const adjacentFaceName = Object.keys(edge.faces).filter(edgeFaceName => {
        return edgeFaceName !== faceName;
      });
      const faceToMatch = faces[adjacentFaceName];
      console.log("faceToMatch", faceToMatch);
      const adjacentColor = faceToMatch[4].faces[adjacentFaceName];
      console.log("adjacentCOlor", adjacentColor);
      console.log("edge.faces[adjacentFaceName]", edge.faces[adjacentFaceName]);
      const hasAdjacentColor = edge.faces[adjacentFaceName] === adjacentColor;
      return hasAdjacentColor;
    }, true);

    console.log(isCross);
    return isCross;
  });
}
