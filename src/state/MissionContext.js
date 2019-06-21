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
  if (type === "INIT_OBJECTIVES_STEP") {
    const selectedMission = state.missions[state.selectedMissionIndex];
    const emptyObjectiveTimes = Array.from({
      length: selectedMission.objectives.length
    }).map(() => null);
    return {
      ...state,
      countdownComplete: true,
      scrambleComplete: true,
      objectiveTimes: emptyObjectiveTimes,
      startTime: new Date(),
      endTime: null,
      didComplete: false
    };
  }
  if (type === "SET_START_TIME") return { ...state, startTime: payload };
  if (type === "SET_OBJECTIVE_TIME") {
    const newObjectiveTimes = [
      ...state.objectiveTimes.slice(0, payload.index),
      payload.time,
      ...state.objectiveTimes.slice(payload.index)
    ];
    const didComplete = newObjectiveTimes.every(time => !!time);
    const endTime = didComplete ? payload.time : null;
    return {
      ...state,
      objectiveTimes: newObjectiveTimes,
      didComplete,
      endTime
    };
  }
  if (type === "SET_MULTIPLE_OBJECTIVE_TIMES") {
    const newObjectiveTimes = state.objectiveTimes.map((time, i) => {
      if (payload.indices.includes(i)) {
        return payload.time;
      }
      return time;
    });
    const didComplete = newObjectiveTimes.every(time => !!time);
    const endTime = didComplete ? payload.time : null;
    return {
      ...state,
      objectiveTimes: newObjectiveTimes,
      didComplete,
      endTime
    };
  }
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
    reset: () => {
      dispatch({ type: "RESET" });
    },
    // TODO: Create cancel
    cancel: () => {
      dispatch({ type: "RESET" });
    },
    // TODO: Create fail
    fail: () => {
      dispatch({ type: "RESET" });
    },
    initObjectivesStep: () => {
      dispatch({ type: "INIT_OBJECTIVES_STEP" });
    },
    setStartTime: (time = new Date()) => {
      dispatch({ type: "SET_START_TIME", payload: time });
    },
    setObjectiveTime: (index, time = new Date()) => {
      dispatch({ type: "SET_OBJECTIVE_TIME", payload: { index, time } });
    },
    setMultipleObjectiveTimes: (indices, time = new Date()) => {
      dispatch({
        type: "SET_MULTIPLE_OBJECTIVE_TIMES",
        payload: { indices, time }
      });
    }
  };
}

export { MissionProvider, useMission };
