import React from "react";
import { useCube } from "../../state/CubeContext.js";
import "./giikerController.scss";

const GiikerController = () => {
  const { setConnectedDevice, giiker, setIsConnected, isConnected } = useCube();

  // TODO: add reset in case the cube gets out of sync
  // set up connection/disconnection events
  const connectGiiker = async () => {
    await giiker.connect();
    setConnectedDevice(giiker);
  };
  const disconnectGiiker = async () => {
    await giiker.disconnect();
    setIsConnected(false);
  };

  return (
    <div
      className={`GiikerControls GiikerControls__${
        isConnected ? "connected" : "disconnected"
      }`}
    >
      {isConnected ? (
        <button onClick={disconnectGiiker} alt="disconnect giiker cube">
          giiker
        </button>
      ) : (
        <button onClick={connectGiiker} alt="connect giiker cube">
          giiker
        </button>
      )}
    </div>
  );
};

export default React.memo(GiikerController);
