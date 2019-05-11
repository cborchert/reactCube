import React from "react";
import Cube from "./components/Cube/Cube.js";
import Controls from "./components/Controls/Controls.js";
import GiikerController from "./components/GiikerController/GiikerController.js";
import { CubeProvider } from "./state/CubeContext.js";
import { SceneProvider } from "./state/SceneContext.js";
import "./App.css";

function App() {
  return (
    <div className="App">
      <SceneProvider>
        <CubeProvider>
          <Controls />
          <GiikerController />
          <Cube deleteTransparent={true} />
        </CubeProvider>
      </SceneProvider>
    </div>
  );
}

export default App;
