import React from "react";
import Cube from "./components/Cube/Cube.js";
import Controls from "./components/Controls/Controls.js";
import GiikerController from "./components/GiikerController/GiikerController.js";
import { CubeProvider } from "./state/CubeContext.js";
import { SceneProvider } from "./state/SceneContext.js";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <SceneProvider>
        <CubeProvider>
          <div className="App__controls">
            <Controls />
            <GiikerController />
          </div>
          <Cube deleteTransparent={true} />
        </CubeProvider>
      </SceneProvider>
    </div>
  );
}

export default App;
