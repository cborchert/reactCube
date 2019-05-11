import React from "react";
import { useCube } from "../../state/CubeContext.js";
import { useScene } from "../../state/SceneContext.js";
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

const Controls = () => {
  const { turnCube, resetCube } = useCube();
  const { toCenter, stepX, stepY, stepZ } = useScene();
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
            {move}
          </button>
        ))}
        <button onClick={resetCube}>resetCube</button>
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
