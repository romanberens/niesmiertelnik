import WebSocket from "ws";
import { state } from "./state.js";

export function startWS(server) {
  const clients = new Set();

  // --- UPPERSTREAM: PSP SIMULATOR ---
  const upstream = new WebSocket("wss://niesmiertelnik.replit.app/ws");

  // --- LOCAL CLIENTS (frontendy) ---
  server.on("connection", (ws) => {
    console.log(">>> WS CLIENT CONNECTED");
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
  });

  upstream.on("open", () => {
    console.log("### UPPERSTREAM CONNECTED (PSP)");
  });

  upstream.on("close", () => {
    console.log("### UPPERSTREAM CLOSED");
  });

  upstream.on("error", (err) => {
    console.log("### UPPERSTREAM ERROR:", err);
  });

  upstream.on("message", (msg) => {
    console.log("### RAW FROM PSP:", msg.toString());

    let data;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      console.log("### JSON ERROR:", e);
      return;
    }

    console.log("### PARSED:", data.type);

    switch (data.type) {
      case "tag_telemetry":
        state.firefighters[data.firefighter.id] = data;
        break;

      case "beacons_status":
        for (const b of data.beacons) state.beacons[b.id] = b;
        break;

      case "alert":
        state.alerts[data.id] = data;
        break;

      case "building_config":
        state.building = data.building;
        break;
    }

    // --- BROADCAST TO LOCAL WS CLIENTS ---
    for (const client of clients) {
      client.send(JSON.stringify(data));
    }
  });
}
