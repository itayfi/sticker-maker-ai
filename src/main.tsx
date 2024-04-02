import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MachineContext } from "./lib/machine.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MachineContext.Provider>
      <App />
    </MachineContext.Provider>
  </React.StrictMode>
);
