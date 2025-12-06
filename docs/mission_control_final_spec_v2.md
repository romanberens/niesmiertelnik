# CYFROWY NIEŚMIERTELNIK PSP – Mission Control (FINAL SPEC v2)

## 1. Cel i zakres
Mission Control to frontend React/TypeScript dla symulatora PSP API v2.7 (WebSocket + REST). Zapewnia monitoring telemetrii 1 Hz, alertów, środowiska, sprzętu (SCBA, PASS, black_box), RECCO, NIB, pogody, hazard zones, nagrywania/replay incydentów oraz kontrolę symulacji. Specyfikacja scala wersję v1 ze wszystkimi brakami i korektami z raportu zgodności.

## 2. Architektura
- **Warstwa API**: `src/api/websocket.ts`, `src/api/rest.ts` – pełny mapping WS/REST z PSP v2.7, handshake `welcome`, komendy sterujące, replay/recording.
- **Modele danych**: TypeScript interfaces w `src/types/api.ts` (telemetria, alerty, sprzęt, RECCO, pogoda, NIB, building, incidents, simulation control).
- **Store** (reaktywny stan, np. prosty event emitter lub React context):
  - `telemetry`, `alerts`, `environment`, `equipment`, `communication`, `building`, `recco`, `weather`, `incidents` (w tym recording/replay status).
- **Hooki**: `useTelemetry`, `useAlerts`, `useEnvironment`, `useEquipment`, `useCommunication`, `useRecco`, `useWeather`, `useIncidents`, `useSimulationControl` – konsumują store + API.
- **Widoki**: CommandCenter, Dashboard, TeamStatus, Environment, BuildingMap, Equipment, Communications.
- **Komponenty**: mapy, listy, kafle, inputy – zgodnie z drzewem komponentów v1 z dodatkami RECCO, pogoda, recording/replay, hazard zones.
- **Logika progów/alertów**: progi warning/critical zgodne z dokumentacją PSP dla środowiska, SCBA, connectivity, alert types.

## 3. Modele danych (TypeScript)
Zbiorcze interfejsy odpowiadają JSON z PSP API v2.7.

```ts
// src/types/api.ts
export interface WelcomeEvent { type: "welcome"; api_version: string; capabilities: string[]; simulation_time: string; }

export interface Position3D { x: number; y: number; z: number; floor: number; accuracy_m: number; confidence: number; dop?: number; }
export interface UwbMetrics { nlos_probability?: number; ranges_m?: number[]; rssi_dbm?: number; }
export interface ConnectionStatus { connection_primary: "lora" | "lte" | "wifi" | "ble" | "offline"; lora_rssi_dbm?: number; lte_rsrp_dbm?: number; wifi_rssi_dbm?: number; gps_fix?: boolean; }

export interface ScbaAlarms { low_pressure?: boolean; very_low_pressure?: boolean; }
export interface ScbaStatus { pressure_bar: number; pressure_pct: number; remaining_time_min: number; consumption_rate_lpm: number; alarms: ScbaAlarms; temperature_c?: number; }
export interface PassStatus { active: boolean; }
export interface BlackBoxStatus { recording: boolean; last_sync_at?: string; }

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

export interface EquipmentSample { scba: ScbaStatus; pass: PassStatus; black_box?: BlackBoxStatus; battery_pct?: number; radio_signal_dbm?: number; device_temp_c?: number; }

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

export interface BeaconStatus { beacon_id: string; online: boolean; battery_pct?: number; position: Position3D; }

export interface HazardZone { id: string; floor: number; type: "fire_risk" | "chemical" | "explosive_gas"; polygon: Array<{ x: number; y: number }>; severity: "warning" | "critical"; }

export interface BuildingConfig { id: string; name: string; floors: number[]; beacons: BeaconStatus[]; hazard_zones?: HazardZone[]; }

export interface AlertEvent {
  type: "alert";
  alert_id: string;
  alert_type:
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
  severity: "warning" | "critical";
  firefighter_id?: string;
  tag_id?: string;
  beacon_id?: string;
  acknowledged?: boolean;
  resolved?: boolean;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface WeatherSample { temperature_c: number; wind_speed_ms: number; wind_bearing_deg: number; pressure_hpa: number; humidity_pct?: number; }
export interface WeatherEvent { type: "weather"; data: WeatherSample; timestamp: string; }

export interface ReccoReflector { id: string; signal_strength_db?: number; distance_m?: number; }
export interface ReccoDetectorEvent { type: "recco_detector"; status: "idle" | "searching" | "hit"; reflectors?: ReccoReflector[]; timestamp: string; }

export interface NibStatus { type: "nib_status"; lte_up: boolean; lora_up: boolean; wifi_up: boolean; gps_lock: boolean; packet_loss_pct?: number; latency_ms?: number; }

export interface FirefighterProfile { id: string; name: string; team: string; role: string; scba_id?: string; tag_id?: string; recco_id?: string; }
export interface FirefightersListEvent { type: "firefighters_list"; firefighters: FirefighterProfile[]; }

export interface BuildingConfigEvent { type: "building_config"; building: BuildingConfig; }
export interface BeaconsStatusEvent { type: "beacons_status"; beacons: BeaconStatus[]; }
export interface TagTelemetryEvent { type: "tag_telemetry"; data: TelemetryTag[]; }
export interface AlertsEvent { type: "alerts"; alerts: AlertEvent[]; }

export interface SimulationControlEvent { type: "simulation_control"; command: string; payload?: Record<string, unknown>; }

export interface MessageEvent { type: "message"; channel: string; sender: string; text: string; timestamp: string; }
export interface EmergencyBroadcastEvent { type: "emergency_broadcast"; text: string; timestamp: string; }
export interface VoiceEvent { type: "voice_event"; status: "start" | "stop"; user: string; channel: string; timestamp: string; }

export interface IncidentItem { id: string; name: string; started_at: string; duration_s: number; }
export interface IncidentTimelineItem { timestamp: string; type: string; payload: Record<string, unknown>; }
export interface RecordingStatus { active: boolean; incident_id?: string; started_at?: string; }
```

## 4. WebSocket mapping (client → handlers)
- Handshake: `welcome` → zapis capabilities/api_version w `communication` store.
- Strumienie: `tag_telemetry` (1 Hz), `alerts` (na zdarzenie), `environment` (zawarte w telemetry), `beacons_status`, `nib_status`, `building_config` (początkowe + zmiany), `firefighters_list` (początkowe + zmiany), `recco_detector` (30 s lub na hit), `weather` (30 s).
- Komunikacja: `message`, `voice_event`, `emergency_broadcast`.
- Kontrola: `simulation_control` odpowiedzi na komendy (`get_history`, `set_speed`, `pause/resume`, `start_recording`, `stop_recording`).
- Ack/resolution: alerty z polami `acknowledged/resolved` obsługiwane w store, z komendami REST/WS do ACK/resolve.

## 5. REST mapping
- `/health` – status API.
- `/building`, `/building/config` – konfiguracja budynku, hazard zones.
- `/beacons`, `/beacons/:id` – lista i szczegóły beaconów.
- `/firefighters`, `/firefighters/:id`, `/firefighters/:id/history` – profil i historia telemetrii.
- `/recco` – stan detektorów/reflektorów.
- `/weather` – aktualna pogoda.
- `/nib` – status sieci NIB z rozbiciem na LTE/LoRa/WiFi.
- `/scba` – dane SCBA.
- `/incidents` (list), `/incidents/:id`, `/incidents/:id/timeline`, `/incidents/:id/replay`, `DELETE /incidents/:id`.
- `/recording/status`, `/recording/start`, `/recording/stop` – nagrywanie.
- `/simulation/control` – komendy: `get_history`, `set_speed`, `pause`, `resume`, `trigger_*` (man_down, sos, environment hazard), `trigger_recco`, `trigger_weather`.

## 6. Stany globalne/store
- `telemetry`: ostatnie próbki tagów, wskaźniki jakości (delay, offline), position confidence, uwb metrics.
- `alerts`: lista alertów z ACK/resolve, mapowanie na UI; typy obejmują `beacon_offline`, `tag_offline`, `explosive_gas`, `high_temperature`, `low_battery`, SCBA alarmy, SOS, man_down.
- `environment`: agregaty dla czujników (co, co2, o2, lel, voc, pm25, temp, humidity) z progami warning/critical; hazard flags.
- `equipment`: SCBA (pressure, remaining_time_min, consumption_rate_lpm, alarms), PASS, black_box, baterie, radio signal.
- `communication`: wiadomości, voice events, capabilities z `welcome`, NIB status LTE/LoRa/WiFi, emergency broadcast state.
- `building`: config, floor list, hazard_zones, beacons status.
- `recco`: status detektora, lista reflektorów, ostatni hit timestamp.
- `weather`: ostatnia próbka pogody.
- `incidents`: lista incydentów, timeline bieżącego replay, `recordingStatus`.

## 7. Logika progów i alertów
- O₂: warning 18–19.5%, critical <18%.
- CO: warning >35 ppm, critical >100 ppm.
- CO₂: warning >1000 ppm, critical >5000 ppm.
- LEL: warning ≥10%, critical ≥25%.
- Temperatura środowiska: warning >60 °C (140 °F), critical >260 °C (500 °F).
- VOC: warning >500 ppb, critical >1000 ppb (przyjąć zgodnie z API rozszerzonym).
- PM2.5: warning >35 µg/m³, critical >55 µg/m³.
- SCBA: warning pressure_pct <20% lub alarms.low_pressure, critical pressure_pct <10% lub alarms.very_low_pressure.
- Bateria: warning <30%, critical <15%.
- Telemetria offline: brak próbki >10 s → status offline, ale powiązać z alertem `tag_offline`/`beacon_offline` z API zamiast duplikować.
- Alerty API mapować 1:1 na UI (man_down, sos, low_o2, high_heart_rate, scba_low_pressure, scba_critical, beacon_offline, tag_offline, explosive_gas, high_temperature, low_battery) z kanałem ACK/resolve.

## 8. Widoki i komponenty (zakres danych)
- **CommandCenter**: MapCanvas (beacons, hazard_zones, firefighters markers z statusami), FloorSelector, lista strażaków, panel szczegółów (telemetria, SCBA, PASS, connectivity, RECCO), AlertBanner globalny.
- **Dashboard**: status symulacji (welcome capabilities, uptime), emergency SOS, metryki środowiska agregowane, liczba aktywnych strażaków, lista alertów, pogoda, NIB.
- **TeamStatus**: kafle strażaków (HR, O₂ progi dwustopniowe, SCBA, PASS, battery, radio), timestamp ostatniej telemetrii, status offline/online.
- **Environment**: tabela/kafle sensorów (co, co2, o2, lel, voc, pm25, temp, humidity) z progami; hazard alerts; wykresy (opcjonalnie).
- **BuildingMap**: 2D plan pięter, hazard zones (fire_risk, chemical, explosive_gas), beacons, strażacy, status offline, overlay RECCO hits.
- **Equipment**: SCBA szczegóły (remaining_time_min, consumption_rate_lpm, alarms), PASS, black_box, baterie, device temp, radio.
- **Communications**: kanały (team_alpha, command, all_units, emergency), log, input, quick messages, PTT events, emergency broadcast, NIB LTE/LoRa/WiFi, capabilities z welcome.
- **Replay/Recording** (wchodzi do Dashboard/CommandCenter): start/stop recording, status `/recording/status`, lista `/incidents`, szczegóły i timeline, replay sterowany komendami WS.

## 9. Hooki – kontrakty
- `useTelemetry`: subskrybuje `tag_telemetry`, zapewnia status online/offline, agregaty HR/O₂/SCBA, pozycje.
- `useAlerts`: zarządza alertami API, ACK/resolve (REST/WS), deduplikuje lokalne statusy.
- `useEnvironment`: oblicza warning/critical per sensor wg progów powyżej; emituje `environmental_hazard_active`.
- `useEquipment`: mapuje SCBA, PASS, black_box, battery, radio; generuje hazard flagi.
- `useCommunication`: zarządza kanałami, NIB, broadcast, capabilities.
- `useRecco`: prezentuje status detektora i reflektorów; integruje z mapą.
- `useWeather`: ostatni sample + trend.
- `useIncidents`: listy, timeline, replay controls, recording status.
- `useSimulationControl`: owija komendy sterujące (trigger events, get_history, speed, pause/resume, start/stop recording).

## 10. Utils
- `formatters`: jednostki (°C/°F, ppm, %), czasy.
- `thresholds`: mapy progów (environment, SCBA, battery, O₂ specyficzne).
- `constants`: kanały komunikacji, kolory statusów, typy alertów, capabilities.

## 11. Scenariusze testowe (manualne)
- Trigger man_down, sos, high_temperature, explosive_gas, beacon_offline, tag_offline, scba_low_pressure/critical.
- O₂ spada z 20% → 18.5% (warning) → 17.5% (critical) – UI odzwierciedla dwustopniowo.
- Weather update 30 s, RECCO hit z reflektorami – wizualizacja na mapie.
- Start/stop recording, sprawdzenie `/recording/status`, odtworzenie `/incidents/:id/replay` + timeline.
- Pausing/resuming simulation, set_speed, get_history via WS.
```
