import React from "react";
import GiiKER from "../utils/giiker.js";
import { useCube } from "./CubeContext.js";
import { giikerStateToCubeState } from "../utils/cubeUtils.js";

const GiikerContext = React.createContext();

function GiikerProvider(props) {
  const [giikerCube, setGiikerCube] = React.useState(null);
  const [giikerDevicePrefix, setGiikerDevicePrefix] = React.useState("Gi");
  const value = React.useMemo(() => {
    return {
      giikerCube,
      setGiikerCube,
      giikerDevicePrefix,
      setGiikerDevicePrefix
    };
  }, [giikerCube, giikerDevicePrefix]);
  return <GiikerContext.Provider value={value} {...props} />;
}

function useGiiker() {
  const context = React.useContext(GiikerContext);
  if (!context) {
    throw new Error("useGiiker must be used within a GiikerProvider");
  }
  const {
    giikerCube,
    setGiikerCube,
    giikerDevicePrefix,
    setGiikerDevicePrefix
  } = context;

  const giikerConnected = !!(giikerCube && giikerCube._device);

  // Set up what to do when the cube connects
  const connectGiiker = async () => {
    const cube = await GiiKER.connect(giikerDevicePrefix);
    console.log("cube connected");
    // Set the cube for further use later
    setGiikerCube(cube);
  };

  return {
    connectGiiker,
    giikerCube,
    giikerConnected,
    giikerDevicePrefix,
    setGiikerDevicePrefix,
    disconnectGiiker:
      giikerCube && giikerCube.disconnect
        ? giikerCube.disconnect
        : () => {
            console.error("cannot disconnect: cube not connected");
          }
  };
}

export { GiikerProvider, useGiiker };
