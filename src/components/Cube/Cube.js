import React from "react";
import { COLORS, FACES } from "../../utils/cubeUtils.js";
import { useCube } from "../../state/CubeContext.js";

import "./cube.scss";

const Cube = props => {
  const { blocks, animationSpeed } = useCube();
  const { deleteTransparent } = props;
  return (
    <div className="scene">
      <div className="pivot">
        <div className="cube">
          {blocks.map(({ initialPosition, ...block }, i) => (
            <Block
              key={`block__${i}`}
              {...block}
              deleteTransparent={deleteTransparent}
              animationSpeed={animationSpeed}
            />
          ))}
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
  animationSpeed
}) => {
  const appliedTransform = `rotateX(${rotateX || 0}deg) rotateY(${rotateY ||
    0}deg) rotateZ(${rotateZ || 0}deg)`;
  const transform = `${appliedTransform} ${baseTransform}`;
  const transition = `${animationSpeed}ms`;
  return (
    <div className="block" style={{ transform, transition }}>
      {faceColors.map((color, i) => {
        return deleteTransparent && color === "_" ? null : (
          <div
            key={FACES[i]}
            className={`block__face block__face--${FACES[i]} block__face--${
              COLORS[color]
            }`}
          >
            <div className="block__face__sticker" />
          </div>
        );
      })}
    </div>
  );
};

export default Cube;
