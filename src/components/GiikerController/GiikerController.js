import React from "react";
import { useCube } from "../../state/CubeContext.js";
import { stringStateToCubeState } from "../../utils/cubeUtils.js";
import { Giiker } from "../../utils/giiker.js";
import "./giikerController.scss";

const giiker = new Giiker();

const GiikerController = () => {
  const { turnCube } = useCube();

  // keep the most recent instance of turnCube as a ref
  // otherwise the callback will always be passed a stale version
  let doTurnCube = React.useRef(turnCube);
  React.useEffect(() => {
    doTurnCube.current = turnCube;
  });

  // set up handle move
  const handleMove = move => {
    if (
      !(move && move.notation) ||
      !doTurnCube ||
      typeof doTurnCube.current !== "function"
    ) {
      // something's not right
      console.error("Move registered, cannot be executed.");
      return;
    }
    doTurnCube.current(move.notation);
  };

  // TODO: add reset in case the cube gets out of sync
  // TODO: add disconnect button

  // set up connection
  const giikerConnected = !!(giiker && giiker._device);
  const connectGiiker = async () => {
    await giiker.connect();
    giiker.on("move", handleMove);
  };

  return (
    <div className="GiikerControls">
      <div>
        <div>Giiker Controls</div>
        {giikerConnected ? null : (
          <button onClick={connectGiiker}>Connect</button>
        )}
      </div>
    </div>
  );
};

export default React.memo(GiikerController);
