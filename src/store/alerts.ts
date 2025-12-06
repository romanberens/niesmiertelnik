import { AlertEvent, AlertsEvent } from "../types/api";
import { createStore } from "./baseStore";

export interface AlertsState {
  alerts: Record<string, AlertEvent>;
}

const initialState: AlertsState = {
  alerts: {},
};

export const alertsStore = createStore<AlertsState>(initialState);

export function ingestAlerts(event: AlertsEvent | { type: "alert" } & AlertEvent) {
  alertsStore.setState((prev) => {
    const alerts = { ...prev.alerts };
    if ((event as AlertsEvent).alerts) {
      (event as AlertsEvent).alerts.forEach((alert) => {
        alerts[alert.alert_id] = alert;
      });
    } else {
      const single = event as AlertEvent;
      alerts[single.alert_id] = single;
    }
    return { ...prev, alerts };
  });
}

export function ackAlert(alertId: string) {
  alertsStore.setState((prev) => {
    const next = { ...prev.alerts[alertId], acknowledged: true } as AlertEvent;
    return { ...prev, alerts: { ...prev.alerts, [alertId]: next } };
  });
}

export function resolveAlert(alertId: string) {
  alertsStore.setState((prev) => {
    const next = { ...prev.alerts[alertId], resolved: true } as AlertEvent;
    return { ...prev, alerts: { ...prev.alerts, [alertId]: next } };
  });
}
