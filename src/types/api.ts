export interface WelcomeEvent {
  type: "welcome";
  api_version: string;
  capabilities: string[];
  simulation_time: string;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
  floor: number;
  accuracy_m: number;
  confidence: number;
  dop?: number;
}

export interface UwbMetrics {
  nlos_probability?: number;
  ranges_m?: number[];
  rssi_dbm?: number;
}

export type ConnectionPrimary = "lora" | "lte" | "wifi" | "ble" | "offline";

export interface ConnectionStatus {
  connection_primary: ConnectionPrimary;
  lora_rssi_dbm?: number;
  lte_rsrp_dbm?: number;
  wifi_rssi_dbm?: number;
  gps_fix?: boolean;
}

export interface ScbaAlarms {
  low_pressure?: boolean;
  very_low_pressure?: boolean;
}

export interface ScbaStatus {
  pressure_bar: number;
  pressure_pct: number;
  remaining_time_min: number;
  consumption_rate_lpm: number;
  alarms: ScbaAlarms;
  temperature_c?: number;
}

export interface PassStatus {
  active: boolean;
}

export interface BlackBoxStatus {
  recording: boolean;
  last_sync_at?: string;
}

export interface EquipmentSample {
  scba: ScbaStatus;
  pass: PassStatus;
  black_box?: BlackBoxStatus;
  battery_pct?: number;
  radio_signal_dbm?: number;
  device_temp_c?: number;
}

export interface EnvironmentSample {
  temperature_c: number;
  humidity_pct: number;
  co_ppm: number;
  co2_ppm: number;
  o2_pct: number;
  lel_pct: number;
  voc_ppb?: number;
  pm25_ugm3?: number;
}

export interface TelemetryTag {
  tag_id: string;
  firefighter_id: string;
  timestamp: string;
  heart_rate_bpm: number;
  spo2_pct?: number;
  environment: EnvironmentSample;
  equipment: EquipmentSample;
  position: Position3D;
  uwb?: UwbMetrics;
  connection: ConnectionStatus;
}

export interface BeaconStatus {
  beacon_id: string;
  online: boolean;
  battery_pct?: number;
  position: Position3D;
}

export interface HazardZone {
  id: string;
  floor: number;
  type: "fire_risk" | "chemical" | "explosive_gas";
  polygon: Array<{ x: number; y: number }>;
  severity: "warning" | "critical";
}

export interface BuildingConfig {
  id: string;
  name: string;
  floors: number[];
  beacons: BeaconStatus[];
  hazard_zones?: HazardZone[];
}

export type AlertType =
  | "man_down"
  | "sos"
  | "low_o2"
  | "high_heart_rate"
  | "scba_low_pressure"
  | "scba_critical"
  | "beacon_offline"
  | "tag_offline"
  | "explosive_gas"
  | "high_temperature"
  | "low_battery";

export interface AlertEvent {
  type: "alert";
  alert_id: string;
  alert_type: AlertType;
  severity: "warning" | "critical";
  firefighter_id?: string;
  tag_id?: string;
  beacon_id?: string;
  acknowledged?: boolean;
  resolved?: boolean;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface WeatherSample {
  temperature_c: number;
  wind_speed_ms: number;
  wind_bearing_deg: number;
  pressure_hpa: number;
  humidity_pct?: number;
}

export interface WeatherEvent {
  type: "weather";
  data: WeatherSample;
  timestamp: string;
}

export interface ReccoReflector {
  id: string;
  signal_strength_db?: number;
  distance_m?: number;
}

export interface ReccoDetectorEvent {
  type: "recco_detector";
  status: "idle" | "searching" | "hit";
  reflectors?: ReccoReflector[];
  timestamp: string;
}

export interface NibStatus {
  type: "nib_status";
  lte_up: boolean;
  lora_up: boolean;
  wifi_up: boolean;
  gps_lock: boolean;
  packet_loss_pct?: number;
  latency_ms?: number;
}

export interface FirefighterProfile {
  id: string;
  name: string;
  team: string;
  role: string;
  scba_id?: string;
  tag_id?: string;
  recco_id?: string;
}

export interface FirefightersListEvent {
  type: "firefighters_list";
  firefighters: FirefighterProfile[];
}

export interface BuildingConfigEvent {
  type: "building_config";
  building: BuildingConfig;
}

export interface BeaconsStatusEvent {
  type: "beacons_status";
  beacons: BeaconStatus[];
}

export interface TagTelemetryEvent {
  type: "tag_telemetry";
  data: TelemetryTag[];
}

export interface AlertsEvent {
  type: "alerts";
  alerts: AlertEvent[];
}

export interface SimulationControlEvent {
  type: "simulation_control";
  command: string;
  payload?: Record<string, unknown>;
}

export interface MessageEvent {
  type: "message";
  channel: string;
  sender: string;
  text: string;
  timestamp: string;
}

export interface EmergencyBroadcastEvent {
  type: "emergency_broadcast";
  text: string;
  timestamp: string;
}

export interface VoiceEvent {
  type: "voice_event";
  status: "start" | "stop";
  user: string;
  channel: string;
  timestamp: string;
}

export interface IncidentItem {
  id: string;
  name: string;
  started_at: string;
  duration_s: number;
}

export interface IncidentTimelineItem {
  timestamp: string;
  type: string;
  payload: Record<string, unknown>;
}

export interface RecordingStatus {
  active: boolean;
  incident_id?: string;
  started_at?: string;
}

export type IncomingEvent =
  | WelcomeEvent
  | BuildingConfigEvent
  | BeaconsStatusEvent
  | TagTelemetryEvent
  | AlertsEvent
  | FirefightersListEvent
  | ReccoDetectorEvent
  | WeatherEvent
  | NibStatus
  | SimulationControlEvent
  | MessageEvent
  | EmergencyBroadcastEvent
  | VoiceEvent;

export type OutgoingMessage =
  | { type: "message"; channel: string; text: string; sender: string }
  | { type: "emergency_broadcast"; text: string }
  | { type: "voice_event"; status: "start" | "stop"; user: string; channel: string }
  | { type: "simulation_control"; command: string; payload?: Record<string, unknown> };
