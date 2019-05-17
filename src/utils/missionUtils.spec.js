import { stringStateToCubeState } from "./cubeUtils";
import { isSolved } from "./missionUtils";

describe("missionUtils", () => {
  describe("isSolved", () => {
    it("detects if cube is solved", () => {
      const cube = stringStateToCubeState(
        "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
      );
      expect(isSolved(cube)).toBe(true);
    });
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
});
