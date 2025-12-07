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

// --- FRONTEND COMPATIBILITY ENDPOINTS ---
export function addFrontendAliases(app) {
  app.get("/building", (req, res) => res.redirect("/api/building"));
  app.get("/firefighters", (req, res) => res.redirect("/api/firefighters"));
  app.get("/alerts", (req, res) => res.redirect("/api/alerts"));
  app.get("/beacons", (req, res) => res.redirect("/api/beacons"));
}
