import React, { useEffect, useRef, useState } from "react";
import "./Objectives.scss";
import { useCube } from "../../../../state/CubeContext.js";

const ObjectivesStep = () => {
  return (
    <React.Fragment>
      <div className="Objectives__stepper">Stepper</div>
      <div className="Objectives__footer">Elapsed Time</div>
    </React.Fragment>
  );
};

export default ObjectivesStep;
