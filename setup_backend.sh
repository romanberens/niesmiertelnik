#!/bin/bash
set -e

BACKEND_DIR="/var/www/niesmiertelnik/backend"

echo "== Tworzenie katalogu backend =="
mkdir -p $BACKEND_DIR
cd $BACKEND_DIR

echo "== Tworzenie package.json =="
cat > package.json << 'EOF'
{
  "name": "niesmiertelnik-backend",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "ws": "^8.17.0"
  }
}
EOF

echo "== Instalacja zależności =="
npm install

echo "== Tworzenie state.js =="
cat > state.js << 'EOF'
export const state = {
  building: null,
  firefighters: {},
  beacons: {},
  alerts: {}
};
EOF

echo "== Tworzenie ws-client.js =="
cat > ws-client.js << 'EOF'
import WebSocket from "ws";
import { state } from "./state.js";

export function startWS(server) {
  const clients = new Set();
  const upstream = new WebSocket("wss://niesmiertelnik.replit.app/ws");

  server.on("connection", ws => {
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
  });

  upstream.on("message", msg => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch {
      return;
    }

    switch (data.type) {
      case "tag_telemetry":
        state.firefighters[data.firefighter.id] = data;
        break;

      case "beacons_status":
        for (const b of data.beacons) {
          state.beacons[b.id] = b;
        }
        break;

      case "alert":
        state.alerts[data.id] = data;
        break;

      case "building_config":
        state.building = data.building;
        break;
    }

    for (const client of clients) {
      client.send(JSON.stringify(data));
    }
  });

  upstream.on("open", () => console.log("Połączono z PSP WebSocket"));
  upstream.on("close", () => console.log("Połączenie WebSocket zamknięte"));
  upstream.on("error", err => console.log("Błąd WS:", err));
}
EOF

echo "== Tworzenie api-proxy.js =="
cat > api-proxy.js << 'EOF'
import axios from "axios";
import { state } from "./state.js";

const BASE = "https://niesmiertelnik.replit.app/api/v1";

export function createRoutes(app) {
  app.get("/api/building", async (req, res) => {
    try {
      if (!state.building) {
        const r = await axios.get(`${BASE}/building`);
        state.building = r.data.building;
      }
      res.json(state.building);
    } catch (e) {
      res.status(500).json({ error: "Cannot fetch building" });
    }
  });

  app.get("/api/firefighters", (req, res) => {
    res.json(Object.values(state.firefighters));
  });

  app.get("/api/alerts", (req, res) => {
    res.json(Object.values(state.alerts));
  });

  app.get("/api/beacons", (req, res) => {
    res.json(Object.values(state.beacons));
  });
}
EOF

echo "== Tworzenie server.js =="
cat > server.js << 'EOF'
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { createRoutes } from "./api-proxy.js";
import { startWS } from "./ws-client.js";

const app = express();
app.use(cors());

createRoutes(app);

const httpServer = createServer(app);

const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
startWS(wss);

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
  console.log("WebSocket on ws://localhost:" + PORT + "/ws");
});
EOF

echo "== Backend gotowy =="
