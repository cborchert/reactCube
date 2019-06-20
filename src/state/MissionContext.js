import React from "react";
import missions from "./missions";

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
  if (type === "START_MISSION") return { ...state, missionStarted: true };
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
    }
  };
}

export { MissionProvider, useMission };
