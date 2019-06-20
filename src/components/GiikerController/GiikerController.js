import React from "react";
import { useCube } from "../../state/CubeContext.js";
import "./giikerController.scss";

// TODO: Should this be in Cube Context ?

const GiikerController = () => {
  const { setConnectedDevice, giiker } = useCube();

  // TODO: add reset in case the cube gets out of sync
  // TODO: add disconnect button
  // set up connection
  const giikerConnected = !!(giiker && giiker._device);
  const connectGiiker = async () => {
    await giiker.connect();
    setConnectedDevice(giiker);
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
