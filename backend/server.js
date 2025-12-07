import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { createRoutes } from "./api-proxy.js";
import { startWS } from "./ws-client.js";

const app = express();
app.use(cors());

// -------------------------
// 1) HTTP SERVER
// -------------------------
const httpServer = createServer(app);

// -------------------------
// 2) WEBSOCKET (POPRAWNY TRYB noServer)
// -------------------------
const wss = new WebSocketServer({ noServer: true });

// logi diagnostyczne
wss.on("connection", (ws) => {
  console.log(">>> WS CLIENT CONNECTED");
  ws.on("close", () => console.log(">>> WS CLIENT DISCONNECTED"));
  ws.on("error", (e) => console.log(">>> WS SOCKET ERROR:", e));
});

// OBSŁUGA HANDSHAKE - KLUCZOWE!!!
httpServer.on("upgrade", (req, socket, head) => {
  if (req.url === "/ws") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy(); // odrzucenie niepoprawnych ścieżek
  }
});

// uruchamiamy odbieranie i broadcast telemetry z PSP
startWS(wss);

// -------------------------
// 3) ROUTES (bez wpływu na WS)
// -------------------------
createRoutes(app);

import("./api-proxy.js").then((mod) => {
  mod.addFrontendAliases?.(app);
});

// -------------------------
// 4) START SERVER
// -------------------------
const PORT = 3001;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("Backend running on http://10.0.1.10:" + PORT);
  console.log("WebSocket running at ws://10.0.1.10:" + PORT + "/ws");
});
