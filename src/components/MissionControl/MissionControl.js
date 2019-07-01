import React from "react";
import { useMission } from "../../state/MissionContext";
import MissionStart from "./steps/MissionStart/MissionStart";
import Scramble from "./steps/Scramble/Scramble";
import Countdown from "./steps/Countdown/Countdown";
import Objectives from "./steps/Objectives/Objectives";
import Summary from "./steps/Summary/Summary";
import CloseButton from "./CloseButton/CloseButton";

const MissionControl = () => {
  const {
    missions,
    selectedMissionIndex,
    missionStarted,
    startMission,
    scrambleComplete,
    scrambleSteps,
    onScrambleStep,
    addScrambleStep,
    nextScrambleStep,
    countdownComplete,
    initObjectivesStep,
    didComplete,
    objectiveTimes,
    setStartTime,
    setObjectiveTime,
    setMultipleObjectiveTimes,
    startTime,
    endTime,
    reset
  } = useMission();

  const currentMission = missions[selectedMissionIndex];

  let MissionScreen = null;
  let CancelButton = <CloseButton close={reset} />;

  // check what step to render
  // TODO: Check cancel and failures
  if (!missionStarted) {
    CancelButton = null;
    MissionScreen = (
      <MissionStart title={currentMission.title} handleStart={startMission} />
    );
  } else if (currentMission.scramble && !scrambleComplete)
    MissionScreen = (
      <Scramble
        scrambleSteps={scrambleSteps}
        onScrambleStep={onScrambleStep}
        addScrambleStep={addScrambleStep}
        nextScrambleStep={nextScrambleStep}
      />
    );
  else if (currentMission.countdown && !countdownComplete)
    MissionScreen = (
      <Countdown
        canSkip={currentMission.canSkipCountdown}
        onMove={initObjectivesStep}
        start={initObjectivesStep}
        countdownDuration={currentMission.countdown}
      />
    );
  else if (!didComplete)
    MissionScreen = (
      <Objectives
        initObjectivesStep={initObjectivesStep}
        objectives={currentMission.objectives}
        objectiveTimes={objectiveTimes}
        startTime={startTime}
        setStartTime={setStartTime}
        setObjectiveTime={setObjectiveTime}
        setMultipleObjectiveTimes={setMultipleObjectiveTimes}
      />
    );
  else if (didComplete) {
    CancelButton = null;
    MissionScreen = (
      <Summary
        startTime={startTime}
        endTime={endTime}
        isSuccess
        reset={reset}
      />
    );
  }

  // otherwise return nothing
  return <React.Fragment>{[CancelButton, MissionScreen]}</React.Fragment>;
};

export default MissionControl;
