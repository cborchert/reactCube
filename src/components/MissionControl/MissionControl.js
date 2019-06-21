import React from "react";
import { useMission } from "../../state/MissionContext";
import MissionStart from "./steps/MissionStart/MissionStart";
import Scramble from "./steps/Scramble/Scramble";
import Countdown from "./steps/Countdown/Countdown";
import Objectives from "./steps/Objectives/Objectives";
import Summary from "./steps/Summary/Summary";

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
  // check what step to render
  // TODO: Check cancel and failures
  if (!missionStarted)
    return (
      <MissionStart title={currentMission.title} handleStart={startMission} />
    );

  if (currentMission.scramble && !scrambleComplete)
    return (
      <Scramble
        scrambleSteps={scrambleSteps}
        onScrambleStep={onScrambleStep}
        addScrambleStep={addScrambleStep}
        nextScrambleStep={nextScrambleStep}
      />
    );

  if (currentMission.countdown && !countdownComplete)
    return (
      <Countdown
        canSkip={currentMission.canSkipCountdown}
        onMove={initObjectivesStep}
        start={initObjectivesStep}
        countdownDuration={currentMission.countdown}
      />
    );

  if (!didComplete)
    return (
      <Objectives
        objectives={currentMission.objectives}
        objectiveTimes={objectiveTimes}
        startTime={startTime}
        setStartTime={setStartTime}
        setObjectiveTime={setObjectiveTime}
        setMultipleObjectiveTimes={setMultipleObjectiveTimes}
      />
    );

  if (didComplete)
    return (
      <Summary
        startTime={startTime}
        endTime={endTime}
        isSuccess
        reset={reset}
      />
    );

  // otherwise return nothing
  return null;
};

export default MissionControl;
