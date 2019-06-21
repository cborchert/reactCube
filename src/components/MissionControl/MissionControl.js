import React from "react";
import { useMission } from "../../state/MissionContext";
import MissionStart from "./steps/MissionStart/MissionStart";
import Scramble from "./steps/Scramble/Scramble";

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
    nextScrambleStep
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
  // otherwise return nothing
  return null;
};

export default MissionControl;
