import React from "react";
import { useMission } from "../../state/MissionContext";
import MissionStart from "./steps/MissionStart/MissionStart";
import Scramble from "./steps/Scramble/Scramble";
import Countdown from "./steps/Countdown/Countdown";

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
    cancel,
    fail,
    initSolvingStep
  } = useMission();

  const currentMission = missions[selectedMissionIndex];
  // check what step to render

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
        onMove={fail}
        start={initSolvingStep}
        countdownDuration={currentMission.countdown}
      />
    );
  // otherwise return nothing
  return null;
};

export default MissionControl;
