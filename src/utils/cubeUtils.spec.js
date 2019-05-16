import {
  getInitialBlocks,
  inv,
  getFaceBlocks,
  stringStateToCubeState,
  parseTurnString,
  applyTransform,
  applyTransformsToFace,
  applyFaceToCube,
  applyTurnToCube,
  applySequenceToCube,
  applyRotationAnimationToCube
} from "./cubeUtils";

describe("cubeUtils", () => {
  describe("getInitialBlocks", () => {
    it("initializes blocks correctly", () => {
      const blocks = getInitialBlocks();
      expect(blocks).toMatchSnapshot();
    });
  });
  describe("inv", () => {
    it("inverses the keys and values of an object", () => {
      const given = { U: "L", R: "U", D: "R", L: "D", F: "F", B: "B" };
      const expected = { L: "U", U: "R", R: "D", D: "L", F: "F", B: "B" };
      expect(inv(given)).toEqual(expected);
    });
    it("inversing a second time will return the initial value", () => {
      const given = { U: "L", R: "U", D: "R", L: "D", F: "F", B: "B" };
      expect(inv(inv(given))).toEqual(given);
    });
  });
  describe("getFaceBlocks", () => {
    it("correctly identifies the blocks in the given layer", () => {
      const blocks = getInitialBlocks();
      //TODO: Add a predefined scramble here
      ["U", "D", "L", "R", "F", "B", "S", "E", "M"].forEach(faceName => {
        expect(getFaceBlocks(faceName, blocks)).toMatchSnapshot();
      });
    });
  });
  describe("stringStateToCubeState", () => {
    it("correctly returns cube face state based on string", () => {
      // the result of the cube after U R F' L'
      const stringState =
        "DURRUFRRRBRBDRBDRBFDDDFFDFFBLLBDBLDLFUUFLLFLLULRUBUUBU";
      const cubeState = stringStateToCubeState(stringState);
      // only concerned with faces
      expect(cubeState.faces).toMatchSnapshot();
    });
    it("returns initial cubestate if the string is malformed", () => {
      // with unallowed characters
      const stringState =
        "ABCDUFRRRBRBDRBDRBFDDDFFDFFBLLBDBLDLFUUFLLFLLULRUBUUBU";
      const cubeState = stringStateToCubeState(stringState);
      const inititialCubeState = getInitialBlocks();
      // only concerned with faces
      expect(cubeState.faces).toEqual(inititialCubeState.faces);
    });
    it("returns initial cubestate if the string is incorrect length", () => {
      // too short
      let stringState = "UBU";
      let cubeState = stringStateToCubeState(stringState);
      const inititialCubeState = getInitialBlocks();
      // only concerned with faces
      expect(cubeState.faces).toEqual(inititialCubeState.faces);

      // too long
      stringState =
        "DURRUFRRRBRBDRBDRBFDDDFFDFFBLLBDBLDLFUUFLLFLLULRUBUUBUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU";
      cubeState = stringStateToCubeState(stringState);
      // only concerned with faces
      expect(cubeState.faces).toEqual(inititialCubeState.faces);
    });
  });
  describe("parseTurnString", () => {
    it("parses turn strings correctly given valid inputs", () => {
      // upper case only
      expect(parseTurnString("U")).toEqual({ faceName: "U", turns: 1 });
      // multiple rotations
      expect(parseTurnString("R2")).toEqual({ faceName: "R", turns: 2 });
      // negative rotations
      expect(parseTurnString("D3'")).toEqual({ faceName: "D", turns: -3 });
      // order independent
      expect(parseTurnString("'4L")).toEqual({ faceName: "L", turns: -4 });
      // ignores noise
      expect(parseTurnString("_U_-+/2xxx'")).toEqual({
        faceName: "U",
        turns: -2
      });
    });
    it("returns null on invalid inputs", () => {
      // no lowercase support for the moment
      expect(parseTurnString("u")).toEqual(null);
      // single, incorrect letters are ignored
      expect(parseTurnString("Z")).toEqual(null);
      // combined movements are ignored
      expect(parseTurnString("R2D2")).toEqual(null);
    });
  });
  describe("applyTransform", () => {
    it("correctly applies the transform", () => {
      const initial = {
        1: "a",
        2: "b",
        3: "c",
        4: "d",
        5: "e",
        6: "f"
      };

      const transform = {
        //The NEW "1" prop should take its value from the OLD "3" value
        1: "3",
        2: "4",
        3: "5",
        4: "6",
        5: "1",
        6: "2"
      };

      const expected = {
        1: "c",
        2: "d",
        3: "e",
        4: "f",
        5: "a",
        6: "b"
      };
      expect(applyTransform(initial, transform)).toEqual(expected);
    });
  });
  describe("applyTransformsToFace", () => {
    const faceTransform = {
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

    const blockTransform = {
      F: "R",
      L: "F",
      B: "L",
      R: "B",
      U: "U",
      D: "D"
    };
    const upperFace = [
      {
        faces: { L: "o", U: "w", B: "b" }
      },
      {
        faces: { U: "w", B: "b" }
      },
      {
        faces: { R: "r", U: "w", B: "b" }
      },
      {
        faces: { L: "o", U: "w" }
      },
      {
        faces: { U: "w" }
      },
      {
        faces: { R: "r", U: "w" }
      },
      {
        faces: { L: "o", U: "w", F: "g" }
      },
      {
        faces: { U: "w", F: "g" }
      },
      {
        faces: { R: "r", U: "w", F: "g" }
      }
    ];
    it("correctly rotates the face and orients the cubes once", () => {
      //Verify
      const oneTurnResult = [
        { faces: { B: "o", L: "g", U: "w" } },
        { faces: { B: "o", U: "w" } },
        { faces: { B: "o", R: "b", U: "w" } },
        { faces: { L: "g", U: "w" } },
        { faces: { U: "w" } },
        { faces: { R: "b", U: "w" } },
        { faces: { F: "r", L: "g", U: "w" } },
        { faces: { F: "r", U: "w" } },
        { faces: { F: "r", R: "b", U: "w" } }
      ];
      expect(
        applyTransformsToFace(upperFace, faceTransform, blockTransform, 1)
      ).toEqual(oneTurnResult);
    });
    it("correctly rotates the face and orients the cubes several times", () => {
      //Verify
      const threeTurnResult = [
        { faces: { L: "b", B: "r", U: "w" } },
        { faces: { B: "r", U: "w" } },
        { faces: { B: "r", R: "g", U: "w" } },
        { faces: { L: "b", U: "w" } },
        { faces: { U: "w" } },
        { faces: { R: "g", U: "w" } },
        { faces: { F: "o", L: "b", U: "w" } },
        { faces: { F: "o", U: "w" } },
        { faces: { F: "o", R: "g", U: "w" } }
      ];
      expect(
        applyTransformsToFace(upperFace, faceTransform, blockTransform, 3)
      ).toEqual(threeTurnResult);
    });
    it("correctly rotates the face and orients the cubes negative times", () => {
      //Verify
      const negOneTurnResult = [
        { faces: { L: "b", B: "r", U: "w" } },
        { faces: { B: "r", U: "w" } },
        { faces: { B: "r", R: "g", U: "w" } },
        { faces: { L: "b", U: "w" } },
        { faces: { U: "w" } },
        { faces: { R: "g", U: "w" } },
        { faces: { F: "o", L: "b", U: "w" } },
        { faces: { F: "o", U: "w" } },
        { faces: { F: "o", R: "g", U: "w" } }
      ];
      expect(
        applyTransformsToFace(upperFace, faceTransform, blockTransform, -1)
      ).toEqual(negOneTurnResult);
    });
  });
  describe("applyFaceToCube", () => {
    it("correctly applies a face to a cube", () => {
      const initState = getInitialBlocks();
      const transformedU = [
        { faces: { L: "b", B: "r", U: "w" } },
        { faces: { B: "r", U: "w" } },
        { faces: { B: "r", R: "g", U: "w" } },
        { faces: { L: "b", U: "w" } },
        { faces: { U: "w" } },
        { faces: { R: "g", U: "w" } },
        { faces: { F: "o", L: "b", U: "w" } },
        { faces: { F: "o", U: "w" } },
        { faces: { F: "o", R: "g", U: "w" } }
      ];
      expect(applyFaceToCube(transformedU, "U", initState)).toMatchSnapshot();
    });
  });
  describe("applyTurnToCube", () => {
    it("correctly applies the turn to the cube", () => {
      const initState = getInitialBlocks();
      expect(applyTurnToCube("U", initState)).toMatchSnapshot();
      expect(applyTurnToCube("R'", initState)).toMatchSnapshot();
      expect(applyTurnToCube("D2", initState)).toMatchSnapshot();
    });
  });
  describe("applySequenceToCube", () => {
    it("correctly applies the sequence to the cube", () => {
      const initState = getInitialBlocks();
      expect(applySequenceToCube("R U L D' B2 R", initState)).toMatchSnapshot();
    });
  });
  describe("applyRotationAnimationToCube", () => {
    it("correctly applies the turn to the cube", () => {
      const initState = getInitialBlocks();
      expect(applyRotationAnimationToCube("U", initState)).toMatchSnapshot();
      expect(applyRotationAnimationToCube("R'", initState)).toMatchSnapshot();
      expect(applyRotationAnimationToCube("D2", initState)).toMatchSnapshot();
    });
  });
});
