import React from "react";
import { useGiiker } from "../../state/GiikerContext.js";
import { useCube } from "../../state/CubeContext.js";
import "./giikerController.scss";

const GiikerController = () => {
  console.count("GiikerController");
  const { connectGiiker, giikerConnected, giikerCube } = useGiiker();
  const { turnCube } = useCube();
  const handleMove = move => {
    console.log("handlemove");
    if (!(move && move.notation)) {
      console.error("no move data");
      return;
    }
    turnCube(move.notation);
  };

  React.useEffect(() => {
    console.log("useEffect");
    // if cube is connected, we'll set up a handler for the next movement
    if (giikerConnected) {
      console.log("setting handler");
      //adding teh
      giikerCube.on("move", handleMove);
      // before the next update, remove the handler, since it will be stale
      return () => {
        console.log("useEffect cleanup");
        if (giikerCube && giikerCube.off) {
          console.log("remove handler");
          giikerCube.off(handleMove);
        }
      };
    }
  });
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
