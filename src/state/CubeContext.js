import React from "react";
import {
  applyTurnToCube,
  applyRotationAnimationToCube,
  getInitialBlocks,
  createScrambledCube
} from "../utils/cubeUtils.js";

const DEFAULT_BLOCKS = getInitialBlocks();
const CubeContext = React.createContext();

function CubeProvider(props) {
  const [blocks, setBlocks] = React.useState(DEFAULT_BLOCKS);
  const [animatingBlocks, setAnimatingBlocks] = React.useState(null);
  const value = React.useMemo(() => {
    return {
      blocks,
      setBlocks,
      animatingBlocks,
      setAnimatingBlocks
    };
  }, [blocks, animatingBlocks]);
  return <CubeContext.Provider value={value} {...props} />;
}

function useCube() {
  const context = React.useContext(CubeContext);
  let timeout = React.useRef(null);
  if (!context) {
    throw new Error("useCube must be used within a CubeProvider");
  }
  const { blocks, setBlocks, animatingBlocks, setAnimatingBlocks } = context;
  // TODO: allow control of this
  const animationSpeed = 120;
  return {
    blocks: animatingBlocks ? animatingBlocks : blocks,
    animationSpeed: animatingBlocks ? animationSpeed : 0,
    turnCube: turnString => {
      if (timeout && timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      setAnimatingBlocks(applyRotationAnimationToCube(turnString, blocks));
      setBlocks(applyTurnToCube(turnString, blocks));
      timeout.current = setTimeout(() => {
        setAnimatingBlocks(null);
        timeout.current = null;
      }, animationSpeed);
    },
    setCubeState: (cubeState, turnString) => {
      if (timeout && timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      if (turnString) {
        setAnimatingBlocks(applyRotationAnimationToCube(turnString, blocks));
        timeout.current = setTimeout(() => {
          setAnimatingBlocks(null);
          timeout.current = null;
        }, animationSpeed);
      }
      setBlocks(cubeState);
    },
    randomizeCube: () => {
      if (timeout && timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      setBlocks(createScrambledCube());
    },
    resetCube: () => {
      if (timeout && timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      setBlocks([...DEFAULT_BLOCKS]);
    }
  };
}

export { CubeProvider, useCube };
