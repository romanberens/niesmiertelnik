import { IncidentItem, IncidentTimelineItem, RecordingStatus } from "../types/api";
import { createStore } from "./baseStore";

export interface IncidentsState {
  list: IncidentItem[];
  currentTimeline: IncidentTimelineItem[];
  recording?: RecordingStatus;
}

const initialState: IncidentsState = {
  list: [],
  currentTimeline: [],
};

export const incidentsStore = createStore<IncidentsState>(initialState);

export function setIncidents(list: IncidentItem[]) {
  incidentsStore.setState((prev) => ({ ...prev, list }));
}

export function setTimeline(timeline: IncidentTimelineItem[]) {
  incidentsStore.setState((prev) => ({ ...prev, currentTimeline: timeline }));
}

export function setRecordingStatus(status: RecordingStatus) {
  incidentsStore.setState((prev) => ({ ...prev, recording: status }));
}
