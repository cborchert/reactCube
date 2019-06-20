import React from "react";
import { useMission } from "../../state/MissionContext";
import MissionStart from "./steps/MissionStart/MissionStart";

const MissionControl = () => {
  const {
    missions,
    selectedMissionIndex,
    missionStarted,
    startMission
  } = useMission();

  // check what step to render
  if (!missionStarted) {
    const missionTitle = missions[selectedMissionIndex].title;
    return <MissionStart title={missionTitle} handleStart={startMission} />;
  }
  // otherwise return nothing
  return null;
};

export default MissionControl;
