import React from "react";
import { useCube } from "../../state/CubeContext.js";
import { stringStateToCubeState } from "../../utils/cubeUtils.js";
import { Giiker } from "../../utils/giiker.js";
import "./giikerController.scss";

const giiker = new Giiker();

const GiikerController = () => {
  // const { turnCube, setCubeState } = useCube();
  const { setCubeState } = useCube();

  // keep the most recent instance of turnCube / setCubeState as a ref
  // otherwise the callback will always be passed a stale version
  let doSetCubeState = React.useRef(setCubeState);
  // let doTurnCube = React.useRef(turnCube);
  React.useEffect(() => {
    doSetCubeState.current = setCubeState;
    // doTurnCube.current = turnCube;
  });

  // set up handle move
  const handleMove = move => {
    if (
      !(move && move.notation) ||
      // !doTurnCube ||
      // typeof doTurnCube.current !== "function" ||
      typeof doSetCubeState.current !== "function" ||
      !(giiker && giiker.stateString)
    ) {
      // something's not right
      console.error("Move registered, cannot be executed.");
      return;
    }
    // we're cheating and using setCubeState for the moment because using turnCube does not work well when executing center layer moves.
    // for example, when executing an M or M' move, giiker returns 2 movements, one R and one L' which:
    // 1) Has the advantage of not moving the Front's orientation
    // but 2) Has the disadvantage of the two calls being so close together that there's not enough time to apply the first move before the second is applied to the old state
    // TODO: a solution to this would be to record an array of movements here in the move handler (stored in a ref) and to send that to the store for application all at once, then to reset the ref on update
    doSetCubeState.current(
      stringStateToCubeState(giiker.stateString),
      move.notation
    );
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
