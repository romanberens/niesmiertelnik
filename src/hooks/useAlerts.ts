import { useEffect } from "react";
import { alertsStore, ingestAlerts, ackAlert, resolveAlert } from "../store/alerts";
import { useStore } from "./useStore";
import { AlertEvent, AlertsEvent } from "../types/api";

export function useAlerts(event?: AlertsEvent | AlertEvent) {
  useEffect(() => {
    if (event) {
      if ((event as AlertsEvent).alerts) {
        ingestAlerts(event as AlertsEvent);
      } else {
        ingestAlerts({ ...(event as AlertEvent), type: "alert" });
      }
    }
  }, [event]);

  const state = useStore(alertsStore);

  return {
    ...state,
    ackAlert,
    resolveAlert,
  };
}
