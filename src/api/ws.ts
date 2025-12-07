import { ingestTelemetry } from "../store/telemetry";
import { ingestAlerts } from "../store/alerts";
import { setBuilding, updateBeacons } from "../store/building";

/**
 * 1) Dynamiczny wybór URL WebSocket:
 *    - jeśli ustawiono w .env → używamy go
 *    - HTTPS → automatycznie wss://
 *    - HTTP → automatycznie ws://
 *    - fallback lokalny dla dev
 */
const protocol = window.location.protocol === "https:" ? "wss" : "ws";

// PRIORYTET 1: adres z .env (używane na VPS)
const ENV_URL = import.meta.env.VITE_WS_URL;

// PRIORYTET 2: automatyczne wykrywanie hosta
const AUTO_URL = `${protocol}://${window.location.hostname}:3001/ws`;

// PRIORYTET 3: fallback lokalny
const DEFAULT_URL = "ws://localhost:3001/ws";

const WS_URL = ENV_URL || AUTO_URL || DEFAULT_URL;

console.log("🔧 WS USING URL:", WS_URL);

let ws: WebSocket | null = null;

export function initWebSocket() {
  if (ws) return;

  ws = new WebSocket(WS_URL);

  ws.onopen = () => console.log("🌐 FRONTEND WS CONNECTED:", WS_URL);

  ws.onclose = () => {
    console.log("⚠️ FRONTEND WS DISCONNECTED — reconnecting...");
    ws = null;
    setTimeout(initWebSocket, 2000);
  };

  ws.onerror = (e) => console.log("❌ FRONTEND WS ERROR:", e);

  ws.onmessage = (msg) => {
    let data;
    try {
      data = JSON.parse(msg.data);
    } catch {
      return;
    }

    console.log("📩 FRONTEND WS EVENT:", data.type);

    switch (data.type) {
      case "tag_telemetry": {
        const sample = {
          tag_id: data.tag_id,
          firefighter_id: data.firefighter.id,
          firefighter_name: data.firefighter.name,
          sensors: data.sensors,
          device: data.device,
          timestamp: data.timestamp,
        };

        ingestTelemetry({ data: [sample] });
        break;
      }

      case "alert":
        ingestAlerts({ type: "alert", ...data });
        break;

      case "alerts":
        ingestAlerts({ alerts: data.alerts });
        break;

      case "beacons_status":
        updateBeacons(data.beacons);
        break;

      case "building_config":
        setBuilding(data.building);
        break;
    }
  };
}
