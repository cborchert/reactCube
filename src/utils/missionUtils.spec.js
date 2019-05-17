import { stringStateToCubeState } from "./cubeUtils";
import {
  isSolved,
  isFaceSingleColor,
  getFaceNameAndColor,
  detectCrosses
} from "./missionUtils";

describe("missionUtils", () => {
  describe("isSolved", () => {
    it("detects if cube is solved", () => {
      const cube = stringStateToCubeState(
        "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
      );
      expect(isSolved(cube)).toBe(true);
    });
    // While this shouldn't happen it's best to mention explicitly, and it is by design.
    it("detects if cube is solved, even if faces are not in initial order", () => {
      const cube = stringStateToCubeState(
        "LLLLLLLLLRRRRRRRRRUUUUUUUUUDDDDDDDDDFFFFFFFFFBBBBBBBBB"
      );
      expect(isSolved(cube)).toBe(true);
    });
    it("detects if cube is not solved", () => {
      const cube = stringStateToCubeState(
        "UFUUFUUFURRRRRRRRRFDFFDFFDFDBDDBDDBDLLLLLLLLLBUBBUBBUB"
      );
      expect(isSolved(cube)).toBe(false);
    });
  });
  describe("isFaceSingleColor", () => {
    it("is tested", () => {
      expect(true).toBe(false);
    });
  });
  describe("getFaceNameAndColor", () => {
    it("is tested", () => {
      expect(true).toBe(false);
    });
  });
  describe("detectCrosses", () => {
    it("is tested", () => {
      expect(true).toBe(false);
    });
  });
});
