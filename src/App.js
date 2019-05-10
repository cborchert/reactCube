import React from "react";
import Cube from "./components/Cube/Cube.js";
import Controls from "./components/Controls/Controls.js";
import { CubeProvider } from "./state/CubeContext.js";
import "./App.css";

function App() {
  return (
    <div className="App">
      <CubeProvider>
        <Controls />
        <Cube deleteTransparent={true} />
      </CubeProvider>
    </div>
  );
}

export default App;
