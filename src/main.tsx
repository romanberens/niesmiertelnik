import "./styles/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { initWebSocket } from "./api/ws";

// stores — potrzebne zarówno do działania aplikacji, jak i debugowania
import { telemetryStore } from "./store/telemetry";
import { buildingStore } from "./store/building";
import { alertsStore } from "./store/alerts";

// DEBUG: wystawiamy store’y do konsoli
(window as any).telemetryStore = telemetryStore;
(window as any).buildingStore = buildingStore;
(window as any).alertsStore = alertsStore;

// inicjalizacja WebSocket
initWebSocket();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
