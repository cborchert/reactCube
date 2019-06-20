import React from "react";
import Cube from "./components/Cube/Cube.js";
import Mission from "./components/Mission/Mission.js";
import Controls from "./components/Controls/Controls.js";
import GiikerController from "./components/GiikerController/GiikerController.js";
import { CubeProvider } from "./state/CubeContext.js";
import { MissionProvider } from "./state/MissionContext.js";
import { SceneProvider } from "./state/SceneContext.js";
import MissionControl from "./components/MissionControl/MissionControl.js";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <SceneProvider>
        <CubeProvider>
          <MissionProvider>
            <MissionControl />
            <div className="App__controls">
              <Controls />
              <GiikerController />
            </div>
            <div className="App__cubeContainer">
              <Cube deleteTransparent={true} />
            </div>
          </MissionProvider>
        </CubeProvider>
      </SceneProvider>
    </div>
  );
}

export default App;
