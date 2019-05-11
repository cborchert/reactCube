import React from "react";
import Cube from "./components/Cube/Cube.js";
import Controls from "./components/Controls/Controls.js";
import GiikerController from "./components/GiikerController/GiikerController.js";
import { CubeProvider } from "./state/CubeContext.js";
import { SceneProvider } from "./state/SceneContext.js";
import { GiikerProvider } from "./state/GiikerContext.js";
import "./App.css";

function App() {
  return (
    <div className="App">
      <SceneProvider>
        <CubeProvider>
          <GiikerProvider>
            <Controls />
            <GiikerController />
            <Cube deleteTransparent={true} />
          </GiikerProvider>
        </CubeProvider>
      </SceneProvider>
    </div>
  );
}

export default App;
