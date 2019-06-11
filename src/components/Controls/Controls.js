import React from "react";
import { useCube } from "../../state/CubeContext.js";
import { useScene } from "../../state/SceneContext.js";
import { inv } from "../../utils/cubeUtils.js";
import "./controls.scss";

const MOVES = [
  "U",
  "U'",
  "R",
  "R'",
  "F",
  "F'",
  "L",
  "L'",
  "D",
  "D'",
  "B",
  "B'",
  "M",
  "M'",
  "E",
  "E'",
  "S",
  "S'"
];

const KEY_TO_MOVE_MAP = {
  w: "U",
  W: "U'",
  d: "R",
  D: "R'",
  s: "F",
  S: "F'",
  a: "L",
  A: "L'",
  x: "D",
  X: "D'",
  z: "B",
  Z: "B'",
  r: "M",
  R: "M'",
  f: "E",
  F: "E'",
  v: "S",
  V: "S'"
};

const MOVE_TO_KEY_MAP = inv(KEY_TO_MOVE_MAP);

const Controls = () => {
  const { turnCube, resetCube, randomizeCube } = useCube();
  const { toCenter, stepX, stepY, stepZ } = useScene();

  // Add event listeners
  React.useEffect(() => {
    // If released key is our target key then set to false
    const keyHandler = ({ key }) => {
      if (key === "ArrowLeft") {
        stepY(-22.5);
      } else if (key === "ArrowRight") {
        stepY(22.5);
      } else if (key === "ArrowDown") {
        stepX(-22.5);
      } else if (key === "ArrowUp") {
        stepX(22.5);
      } else if (key === "/") {
        toCenter();
      } else {
        const move = KEY_TO_MOVE_MAP[key];
        if (move) {
          turnCube(move);
        }
      }
    };

    window.addEventListener("keyup", keyHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keyup", keyHandler);
    };
  }, [stepX, stepY, toCenter, turnCube]);

  return (
    <div className="Controls">
      <div>
        <div>Cube Movements</div>
        {MOVES.map(move => (
          <button
            key={move}
            onClick={() => {
              turnCube(move);
            }}
          >
            {MOVE_TO_KEY_MAP[move] ? `[${MOVE_TO_KEY_MAP[move]}] ` : ""}
            {move}
          </button>
        ))}
        <button onClick={resetCube}>resetCube</button>
        <button onClick={randomizeCube}>randomizeCube</button>
      </div>
      <div>
        <div>Rotation</div>
        <button onClick={() => stepX(45)}>X+</button>
        <button onClick={() => stepX(-45)}>X-</button>
        <button onClick={() => stepY(45)}>Y+</button>
        <button onClick={() => stepY(-45)}>Y-</button>
        <button onClick={() => stepZ(45)}>Z+</button>
        <button onClick={() => stepZ(-45)}>Z-</button>
        <button onClick={toCenter}>Snap To Center</button>
      </div>
    </div>
  );
};

export default Controls;
