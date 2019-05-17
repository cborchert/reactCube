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
      const adjacentFaceName = Object.keys(edge.faces).filter(edgeFaceName => {
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
