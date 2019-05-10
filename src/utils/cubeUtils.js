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

export { COLORS, FACES, faceFilters };
