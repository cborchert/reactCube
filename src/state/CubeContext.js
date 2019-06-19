import React from "react";
import {
  applyTurnToCube,
  applyRotationAnimationToCube,
  getInitialBlocks,
  createScrambledCube,
  stringStateToCubeState
} from "../utils/cubeUtils.js";

const CubeContext = React.createContext();
const DEFAULT_BLOCKS = getInitialBlocks();
// TODO: Test
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
  const [blocksState, blocksDispatch] = React.useReducer(blockReducer, {
    blocks: DEFAULT_BLOCKS
  });

  const [animatingBlocks, setAnimatingBlocks] = React.useState(null);
  const value = React.useMemo(() => {
    return {
      blocks: blocksState.blocks,
      setBlocks: newBlocks => {
        blocksDispatch({ type: "SET_BLOCKS", value: newBlocks });
      },
      animatingBlocks,
      setAnimatingBlocks
    };
  }, [blocksState, animatingBlocks]);

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
  /**
   * Clear any existing animation timeouts
   */
  const clearAnimationTimeout = () => {
    if (timeout && timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  };

  const cancelAnimation = () => {
    setAnimatingBlocks(null);
    timeout.current = null;
  };

  return {
    blocks: animatingBlocks ? animatingBlocks : blocks,
    animationSpeed: animatingBlocks ? animationSpeed : 0,
    /**
     * Applies turnString to the cube; first we set a CSS animation and then an actual mutation on the blocks
     * @param {string} turnString the move notation to apply to the cube
     */
    turnCube: turnString => {
      // clear any previous animation timeouts
      clearAnimationTimeout();

      // set up the animation
      setAnimatingBlocks(applyRotationAnimationToCube(turnString, blocks));
      // set up the actual block mutation
      setBlocks(applyTurnToCube(turnString, blocks));
      // after the turn is completed, remove the animation
      timeout.current = setTimeout(cancelAnimation, animationSpeed);
    },
    /**
     * Applies turnString to cube for animation purposes ONLY, and then replaces the cube state with the given cubeState
     */
    setCubeState: (cubeState, turnString) => {
      clearAnimationTimeout();

      // perform animation
      if (turnString) {
        setAnimatingBlocks(applyRotationAnimationToCube(turnString, blocks));
        timeout.current = setTimeout(cancelAnimation, animationSpeed);
      }
      // set the state
      setBlocks(cubeState);
    },
    /**
     * Randomizes the cube state
     */
    randomizeCube: () => {
      clearAnimationTimeout();
      setBlocks(createScrambledCube());
    },
    /**
     * Resets the cube state to the default state
     */
    resetCube: () => {
      clearAnimationTimeout();
      setBlocks([...DEFAULT_BLOCKS]);
    }
  };
}

export { CubeProvider, useCube };
