import React from "react";
import {
  applyTurnToCube,
  applyRotationAnimationToCube,
  getInitialBlocks,
  createScrambledCube,
  stringStateToCubeState,
  cubeStateToStringState
} from "../utils/cubeUtils.js";
import { Giiker } from "../utils/giiker.js";

const CubeContext = React.createContext();
const DEFAULT_BLOCKS = getInitialBlocks();
// TESTING ONLY: If you ever feel like starting with a specific state, use the following
// const DEFAULT_BLOCKS = stringStateToCubeState(
//   "FULUUUBUURRURRRRRRRFFFFFFFFDDDDDDDDDLLULLLLLLBBUBBBBBB"
// );

function blockReducer(state, action) {
  if (action.type === "SET_BLOCKS") {
    return { ...state, blocks: action.value };
  }
  return state;
}

function CubeProvider(props) {
  // Set up context state
  const [blocksState, blocksDispatch] = React.useReducer(blockReducer, {
    blocks: DEFAULT_BLOCKS
  });
  const [animatingBlocks, setAnimatingBlocks] = React.useState(null);
  const [moveHistory, setMoveHistory] = React.useState([]);
  const value = React.useMemo(() => {
    return {
      blocks: blocksState.blocks,
      setBlocks: newBlocks => {
        blocksDispatch({ type: "SET_BLOCKS", value: newBlocks });
      },
      animatingBlocks,
      setAnimatingBlocks,
      moveHistory,
      setMoveHistory
    };
  }, [blocksState, animatingBlocks, moveHistory]);
  return <CubeContext.Provider value={value} {...props} />;
}

function useCube() {
  const context = React.useContext(CubeContext);
  if (!context) {
    throw new Error("useCube must be used within a CubeProvider");
  }
  const {
    blocks,
    setBlocks,
    animatingBlocks,
    setAnimatingBlocks,
    moveHistory,
    setMoveHistory
  } = context;

  // console.log(cubeStateToStringState(blocks));
  // Set up the animation timing
  const timeout = React.useRef(null);
  // TODO: allow control of this
  const animationSpeed = 120;
  /**
   * Clear any existing animation timeouts
   */
  const clearAnimationTimeout = () => {
    if (timeout && timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  };
  /**
   * Remove animating blocks from display
   */
  const cancelAnimation = () => {
    setAnimatingBlocks(null);
    timeout.current = null;
  };

  // The functions
  /**
   * Updates the cubeHistory
   * @param {String} move
   */
  const setCubeHistory = turnString => {
    moveHistory.push({ move: turnString, time: new Date() });
    setMoveHistory(moveHistory);
  };
  /**
   * Updates the cubeHistory
   * @param {String} move
   */
  const resetCubeHistory = turnString => {
    setMoveHistory([]);
  };

  /**
   * Applies turnString to the cube; first we set a CSS animation and then an actual mutation on the blocks
   * @param {string} turnString the move notation to apply to the cube
   */
  const turnCube = turnString => {
    // clear any previous animation timeouts
    clearAnimationTimeout();
    // set up the animation
    setAnimatingBlocks(applyRotationAnimationToCube(turnString, blocks));
    // set up the actual block mutation
    setBlocks(applyTurnToCube(turnString, blocks));
    // after the turn is completed, remove the animation
    timeout.current = setTimeout(cancelAnimation, animationSpeed);
    setCubeHistory(turnString);
  };

  /**
   * Applies turnString to cube for animation purposes ONLY, and then replaces the cube state with the given cubeState
   * @param {Object} cubeState the new cubestate
   * @param {string} turnString the animation to be applied
   */
  const setCubeState = (cubeState, turnString) => {
    clearAnimationTimeout();
    // perform animation
    if (turnString) {
      setAnimatingBlocks(applyRotationAnimationToCube(turnString, blocks));
      timeout.current = setTimeout(cancelAnimation, animationSpeed);
    }
    // set the state
    setBlocks(cubeState);
  };

  /**
   * Randomizes the cube state
   */
  const randomizeCube = () => {
    clearAnimationTimeout();
    setBlocks(createScrambledCube());
  };

  /**
   * Resets the cube state to the default state
   */
  const resetCube = () => {
    clearAnimationTimeout();
    setBlocks([...DEFAULT_BLOCKS]);
  };

  /**
   * Sets connected device
   * @param {*} device the device instance
   */
  const setConnectedDevice = device => {
    connectedDevice.current = device;
    if (device && device.stateString) {
      setIsConnected(true);
      setBlocks(stringStateToCubeState(device.stateString));
    } else {
      setIsConnected(false);
    }
  };

  // Handle connected devices
  const giiker = React.useRef(new Giiker());
  const [isConnected, setIsConnected] = React.useState(false);
  // TODO: add option to force connected cube to sync on each movement
  let connectedDevice = React.useRef(null);
  // On every update, update the move handlers on the giiker with the FRESHEST versions
  React.useEffect(() => {
    if (connectedDevice && connectedDevice.current) {
      const handleMove = move => {
        if (!(move && move.notation)) {
          // something's not right
          console.error("Move registered, cannot be executed.");
          return;
        }
        turnCube(move.notation);
      };
      connectedDevice.current.on("move", handleMove);
      return () => {
        connectedDevice.current.off("move", handleMove);
      };
    }
  });

  // Pass forward the functions for future use
  return {
    blocks: animatingBlocks ? animatingBlocks : blocks,
    animationSpeed: animatingBlocks ? animationSpeed : 0,
    moveHistory,
    setCubeHistory,
    resetCubeHistory,
    turnCube,
    setCubeState,
    randomizeCube,
    resetCube,
    setConnectedDevice,
    giiker: giiker.current,
    setIsConnected,
    isConnected
  };
}

export { CubeProvider, useCube };
