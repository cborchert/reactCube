import React from "react";
import missions from "./missions";
import { createScrambleSteps } from "../utils/missionUtils.js";

const MissionContext = React.createContext();

const initialMissionState = {
  missions,
  selectedMissionIndex: 0,
  scrambleSteps: [],
  onScrambleStep: 0,
  objectiveTimes: [],
  missionStarted: false,
  scrambleComplete: false,
  countdownComplete: false,
  countdownStartTime: null,
  startTime: null,
  endTime: null,
  didComplete: false,
  didFail: false,
  didCancel: false
};

/**
 * Handles all mission dispatches
 * @param {Object} state the state
 * @param {Object} action the dispatched action
 */
const missionReducer = (state, { type, payload }) => {
  if (type === "RESET")
    return {
      ...initialMissionState,
      selectedMissionIndex: state.selectedMissionIndex
    };
  if (type === "START_MISSION") {
    //TODO: create custom scramble step if necessary
    const { missions, selectedMissionIndex } = state;
    const needsScramble = missions[selectedMissionIndex].scramble;
    // TODO: handle multiple cases
    // if(needsScramble){
    return {
      ...state,
      missionStarted: true,
      scrambleSteps: createScrambleSteps()
    };
    // }
  }
  //TODO: create init scramble
  if (type === "ADD_SCRAMBLE_STEP") {
    // add payload to current position
    return {
      ...state,
      scrambleSteps: [
        ...state.scrambleSteps.slice(0, state.onScrambleStep),
        payload,
        ...state.scrambleSteps.slice(state.onScrambleStep)
      ]
    };
  }
  if (type === "NEXT_SCRAMBLE_STEP") {
    // advance scramble step
    const nextScrambleStep = state.onScrambleStep + 1;
    if (nextScrambleStep >= state.scrambleSteps.length) {
      // if complete, set scrambleComplete to true
      return {
        ...state,
        scrambleComplete: true
      };
    } else {
      // update onScrambleStep
      return {
        ...state,
        onScrambleStep: nextScrambleStep
      };
    }
  }
  // TODO: Create initSolvingStep
  // default, do nothing
  return state;
};

function MissionProvider(props) {
  const [state, dispatch] = React.useReducer(
    missionReducer,
    initialMissionState
  );
  const value = React.useMemo(
    () => ({
      ...state,
      dispatch
    }),
    [state]
  );
  return <MissionContext.Provider value={value} {...props} />;
}

function useMission() {
  const context = React.useContext(MissionContext);
  if (!context) {
    throw new Error("useMission must be used within a MissionProvider");
  }
  const { dispatch } = context;
  // Pass forward the functions for future use
  return {
    ...context,
    startMission: () => {
      dispatch({ type: "START_MISSION" });
    },
    nextScrambleStep: () => {
      dispatch({ type: "NEXT_SCRAMBLE_STEP" });
    },
    addScrambleStep: notation => {
      dispatch({ type: "ADD_SCRAMBLE_STEP", payload: notation });
    },
    // TODO: Create cancel
    cancel: () => {
      dispatch({ type: "RESET" });
    },
    // TODO: Create fail
    fail: () => {
      dispatch({ type: "RESET" });
    },
    // TODO: Create initSolvingStep
    initSolvingStep: () => {
      dispatch({ type: "RESET" });
    }
  };
}

export { MissionProvider, useMission };
