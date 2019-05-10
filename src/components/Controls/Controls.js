import React from "react";
import { useCube } from "../../state/CubeContext.js";
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
  const { turnCube } = useCube();
  return (
    <div className="Controls">
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
    </div>
  );
};

export default Controls;
