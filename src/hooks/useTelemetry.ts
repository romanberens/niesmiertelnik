import { useEffect } from "react";
import { telemetryStore, ingestTelemetry } from "../store/telemetry";
import { useStore } from "./useStore";
import { TagTelemetryEvent } from "../types/api";

export function useTelemetry(events?: TagTelemetryEvent) {
  useEffect(() => {
    if (events) {
      ingestTelemetry(events);
    }
  }, [events]);

  return useStore(telemetryStore);
}
