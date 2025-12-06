import axios from "axios";
import { BuildingConfig, FirefighterProfile, IncidentItem, IncidentTimelineItem, RecordingStatus, WeatherSample, NibStatus, ReccoDetectorEvent, ScbaStatus } from "../types/api";

const client = axios.create({ baseURL: "/" });

export const restApi = {
  health: () => client.get<{ status: string }>("/health"),
  building: () => client.get<BuildingConfig>("/building"),
  buildingConfig: () => client.get<BuildingConfig>("/building/config"),
  beacons: () => client.get("/beacons"),
  beaconById: (id: string) => client.get(`/beacons/${id}`),
  firefighters: () => client.get<FirefighterProfile[]>("/firefighters"),
  firefighter: (id: string) => client.get<FirefighterProfile>(`/firefighters/${id}`),
  firefighterHistory: (id: string) => client.get(`/firefighters/${id}/history`),
  recco: () => client.get<ReccoDetectorEvent[]>("/recco"),
  weather: () => client.get<WeatherSample>("/weather"),
  nib: () => client.get<NibStatus>("/nib"),
  scba: () => client.get<ScbaStatus[]>("/scba"),
  incidents: () => client.get<IncidentItem[]>("/incidents"),
  incident: (id: string) => client.get<IncidentItem>(`/incidents/${id}`),
  incidentTimeline: (id: string) => client.get<IncidentTimelineItem[]>(`/incidents/${id}/timeline`),
  replayIncident: (id: string) => client.post(`/incidents/${id}/replay`),
  deleteIncident: (id: string) => client.delete(`/incidents/${id}`),
  recordingStatus: () => client.get<RecordingStatus>("/recording/status"),
  startRecording: () => client.post("/recording/start"),
  stopRecording: () => client.post("/recording/stop"),
  simulationControl: (command: string, payload?: Record<string, unknown>) =>
    client.post("/simulation/control", { command, payload }),
};
