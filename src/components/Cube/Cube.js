import React from "react";
import { COLORS, FACES } from "../../utils/cubeUtils.js";
import { useCube } from "../../state/CubeContext.js";
import { useScene } from "../../state/SceneContext.js";

import "./cube.scss";

const Cube = props => {
  const { blocks, animationSpeed, turnCube } = useCube();
  const { sceneRotationCSS } = useScene();
  const { deleteTransparent } = props;
  return (
    <div className="scene">
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