import React from "react";

const SceneContext = React.createContext();

function SceneProvider(props) {
  const [rotateX, setRotateX] = React.useState(-20);
  const [rotateY, setRotateY] = React.useState(20);
  const [rotateZ, setRotateZ] = React.useState(0);
  const value = React.useMemo(() => {
    return {
      rotateX,
      setRotateX,
      rotateY,
      setRotateY,
      rotateZ,
      setRotateZ
    };
  }, [rotateX, rotateY, rotateZ]);
  return <SceneContext.Provider value={value} {...props} />;
}

function useScene() {
  const context = React.useContext(SceneContext);
  if (!context) {
    throw new Error("useScene must be used within a SceneProvider");
  }
  const {
    rotateX,
    setRotateX,
    rotateY,
    setRotateY,
    rotateZ,
    setRotateZ
  } = context;
  const sceneRotationCSS = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
  const stepX = x => {
    setRotateX(rotateX + x);
  };
  const stepY = y => {
    setRotateY(rotateY + y);
  };
  const stepZ = z => {
    setRotateZ(rotateZ + z);
  };
  const toCenter = () => {
    setRotateX(-20);
    setRotateY(20);
    setRotateZ(0);
  };
  return {
    sceneRotationCSS,
    stepX,
    stepY,
    stepZ,
    toCenter
  };
}

export { SceneProvider, useScene };
