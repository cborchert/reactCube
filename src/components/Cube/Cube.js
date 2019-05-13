import React from "react";
import { useGesture } from "react-use-gesture";
import { COLORS, FACES } from "../../utils/cubeUtils.js";
import { useCube } from "../../state/CubeContext.js";
import { useScene } from "../../state/SceneContext.js";

import "./cube.scss";

const Cube = props => {
  console.count("Cube");
  const { blocks, animationSpeed, turnCube } = useCube();
  const { sceneRotationCSS, stepX, stepY, rotateX } = useScene();
  const { deleteTransparent } = props;
  const bind = useGesture({
    onDrag: ({ xy: [x1, y1], previous: [x0, y0] }) => {
      const dX = x1 - x0;
      const dY = y1 - y0;
      if (Math.abs(dY) < 2 && Math.abs(dX) < 2) {
        return;
      }
      const xTrueTurn = Math.abs(rotateX) % 360;
      // rotate along the Y axis of the cube for horizontal drags
      // if we're a half turn in, reverse directions to not confuse the user
      const yDir = xTrueTurn > 90 && xTrueTurn < 270 ? -1 : 1;
      stepY(dX * yDir);
      // rotate along the X axis of the cube for vertical drags
      stepX(-1 * dY);
    }
  });
  return (
    <div className="scene" {...bind()}>
      <div className="pivot" style={{ transform: sceneRotationCSS }}>
        <div className="cube">
          {blocks
            ? blocks.map(({ initialPosition, ...block }, i) => (
                <Block
                  key={`block__${i}`}
                  {...block}
                  deleteTransparent={deleteTransparent}
                  animationSpeed={animationSpeed}
                  turnCube={turnCube}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

const Block = ({
  faceColors,
  rotateX,
  rotateY,
  rotateZ,
  baseTransform,
  deleteTransparent,
  animationSpeed,
  faceActions,
  turnCube
}) => {
  const appliedTransform = `rotateX(${rotateX || 0}deg) rotateY(${rotateY ||
    0}deg) rotateZ(${rotateZ || 0}deg)`;
  const transform = `${appliedTransform} ${baseTransform}`;
  const transition = `${animationSpeed}ms`;
  return (
    <div className="block" style={{ transform, transition }}>
      {faceColors.map((color, i) => {
        const faceAction =
          faceActions && faceActions[i] ? faceActions[i] : null;
        const handleClick = faceAction
          ? () => {
              turnCube(faceAction);
            }
          : () => {};
        return deleteTransparent && color === "_" ? null : (
          <div
            key={FACES[i]}
            className={`block__face block__face--${FACES[i]} block__face--${
              COLORS[color]
            }`}
          >
            <div className="block__face__sticker" onClick={handleClick} />
          </div>
        );
      })}
    </div>
  );
};

export default Cube;
