# Raport zgodności „CYFROWY NIEŚMIERTELNIK PSP – Mission Control”

## 1. Weryfikacja zgodności
- **Pokryte zgodnie z API PSP**
  - Obsługa strumieni `building_config`, `beacons_status`, `nib_status`, `firefighters_list`, `tag_telemetry`, `alerts` została ujęta w specyfikacji aplikacji i odpowiada oficjalnym typom wiadomości WebSocket 1 Hz / 5 s / 10 s opisanym w API v2.7.【F:docs/psp/02_SYMULATOR_API_v2.md†L118-L218】【F:docs/psp/02_SYMULATOR_API_v2.md†L348-L669】
  - Reguła alertu wysokiego tętna (HR > 180 bpm) pokrywa próg `high_heart_rate` (severity: warning) z API.【F:docs/psp/02_SYMULATOR_API_v2.md†L654-L668】

- **Rozbieżności / braki**
  - Brak wsparcia dla wiadomości `recco_detector` oraz `weather`, które są częścią oficjalnego strumienia WebSocket (status detektora RECCO, dane pogodowe 30 s).【F:docs/psp/02_SYMULATOR_API_v2.md†L579-L619】
  - Warstwa REST w specyfikacji obejmuje tylko podstawowe zasoby; pominięto endpointy: `health`, `recco`, `recording/status`, całą rodzinę `incidents` oraz szczegółowe `firefighters/:id/history` i pojedyncze `beacons/:id`.【F:docs/psp/02_SYMULATOR_API_v2.md†L818-L843】【F:docs/psp/02_SYMULATOR_API_v2.md†L846-L879】
  - Logika progów środowiskowych odbiega od norm API: w dokumentacji alarm krytyczny O₂ jest <18%, a przedział 18–19.5% jest tylko ostrzeżeniem; specyfikacja traktuje <19.5% jako krytyczne. Podobnie brak progów dla CO (>100 ppm), CO₂ (>5000 ppm), LEL (>25%) i temperatury środowiskowej (>60 °C) z API.【F:docs/psp/02_SYMULATOR_API_v2.md†L780-L815】
  - Specyfikacja statusów sprzętu nie uwzględnia pól SCBA (`consumption_rate_lpm`, `remaining_time_min`, `alarms.low_pressure/very_low_pressure`), jakości łączności tagu (`connection_primary`, `lora_rssi_dbm`, LTE), ani stanu rejestratora (`black_box`).【F:docs/psp/02_SYMULATOR_API_v2.md†L223-L418】
  - Reguła „brak telemetrii 10 s → OFFLINE” nie jest powiązana z systemowym alertem `tag_offline` generowanym przez symulator, co grozi podwójną lub niespójną obsługą zdarzeń.【F:docs/psp/02_SYMULATOR_API_v2.md†L654-L668】

## 2. Brakujące integracje z API PSP
- **REST**: `health`, `beacons/:id`, `firefighters/:id`, `firefighters/:id/history`, `recco`, `recording/status`, wszystkie endpointy `incidents` (lista, szczegóły, replay, timeline, delete).【F:docs/psp/02_SYMULATOR_API_v2.md†L818-L879】
- **WebSocket**: `recco_detector`, `weather`, `welcome` (do identyfikacji wersji/capabilities), pełne szczegóły `alert` (ack/resolved) oraz komendy sterujące (`get_history`, `set_speed`, `pause/resume`, `start/stop_recording`).【F:docs/psp/02_SYMULATOR_API_v2.md†L118-L418】【F:docs/psp/02_SYMULATOR_API_v2.md†L579-L719】
- **Parametry telemetrii**: LEL, VOC, PM2.5, pełne dane barometryczne (trend, vertical speed, floor confidence), jakość pozycji (confidence, accuracy, DOP), metryki UWB (NLOS probability, ranges, RSSI), stan PASS, `black_box` i szczegóły urządzenia/baterii, stan RECCO reflektorów/detektora, szczegółowe połączenia NIB (LTE/LoRa/WiFi).【F:docs/psp/02_SYMULATOR_API_v2.md†L223-L418】【F:docs/psp/02_SYMULATOR_API_v2.md†L520-L575】【F:docs/psp/02_SYMULATOR_API_v2.md†L780-L815】
- **Różnice modeli**: brak rozbicia alertów na `resolved` i `acknowledged`, brak `hazard_type` w komendach środowiskowych, brak mapowania `alert_id` przy potwierdzaniu, brak identyfikatorów sprzętu (SCBA/HR/recco ids) w kartach personelu.【F:docs/psp/02_SYMULATOR_API_v2.md†L654-L719】【F:docs/psp/02_SYMULATOR_API_v2.md†L223-L418】

## 3. Proponowane poprawki w architekturze
- Dodać store/hook dla **RECCO** (detektor + status reflektorów) oraz kafel w Equipment/Alerts na alerty RECCO, zgodnie z dokumentacją technologii (rola pasywnej lokalizacji).【F:docs/psp/05_TECHNOLOGIA_RECCO.md†L1-L49】
- Rozszerzyć moduł **Environment** o wszystkie czujniki (`co`, `co2`, `o2`, `lel`, `temperature`, `humidity`, `voc`, `pm25`) i progi z tabeli norm/warning/critical; dodać logikę generowania stanów ostrzegawczych zgodną z API (warning vs critical).【F:docs/psp/02_SYMULATOR_API_v2.md†L780-L815】
- Uzupełnić **Equipment/Telemetry** o pola SCBA (`remaining_time_min`, `consumption_rate_lpm`, `alarms.*`), PASS, baterie urządzeń, parametry łączności i `black_box` (nagrywanie).【F:docs/psp/02_SYMULATOR_API_v2.md†L223-L418】
- W widoku **Communications** uwzględnić stan łączności NIB z rozbiciem na LTE/LoRa/WiFi, zasięg GPS oraz statystyki transmisji, zamiast pojedynczego statusu binarnego.【F:docs/psp/02_SYMULATOR_API_v2.md†L520-L575】
- Rozszerzyć **BuildingMap** o hazard zones z konfiguracji budynku (fire_risk, chemical) oraz możliwość wizualizacji filtrów pięter i stref zagrożeń z beacons/hazard data.【F:docs/psp/02_SYMULATOR_API_v2.md†L68-L91】【F:docs/psp/02_SYMULATOR_API_v2.md†L735-L757】
- Dodać **incident replay/recording state** do globalnych stanów, aby odzwierciedlić `/recording/status` i `/incidents/*` z REST.

## 4. Brakujące wymagane integracje
- **RECCO eventy/status** – brak prezentacji aktywacji detektora i wykrytych reflektorów.【F:docs/psp/02_SYMULATOR_API_v2.md†L579-L619】
- **Pogoda** – brak widoku/tile dla danych pogodowych (temperature, wind, pressure) publikowanych co 30 s.【F:docs/psp/02_SYMULATOR_API_v2.md†L599-L618】
- **Nagrywanie/replay incydentów** – brak interfejsu do `start_recording/stop_recording` (WS i REST) oraz przeglądu `/incidents` (historia, timeline, replay).【F:docs/psp/02_SYMULATOR_API_v2.md†L818-L879】【F:docs/psp/02_SYMULATOR_API_v2.md†L672-L719】
- **Szczegółowe alerty sprzętu** – brak obsługi `beacon_offline`, `tag_offline`, `low_battery`, `scba_low_pressure`, `scba_critical` zgodnie z listą typów alertów.【F:docs/psp/02_SYMULATOR_API_v2.md†L654-L668】

## 5. Niezbędne zmiany w logice Mission Control
| Wymagania PSP | Stan specyfikacji | Zmiana do wdrożenia |
| --- | --- | --- |
| Alert O₂: warning 18–19.5%, critical <18% | Critical ustawiony na <19.5% | Zastosować dwustopniowe progi zgodnie z tabelą środowiskową | 
| Czujniki: CO/CO₂/LEL/VOC/PM2.5/temperature/humidity | Uwzględniono tylko temp/CO₂/O₂/wilgotność | Rozszerzyć model telemetryczny i kafle środowiska | 
| Alerty `beacon_offline`, `tag_offline`, `explosive_gas`, `high_temperature` | Nie wymienione | Dodać mapping alertów i UI dla nowych typów | 
| REST `/health`, `/recco`, `/recording/status`, `/incidents*` | Nie ujęte | Dodać klienckie serwisy i widoki/panele do tych danych | 
| WebSocket `recco_detector`, `weather`, `welcome` capabilities | Brak w specyfikacji | Rozszerzyć warstwę WebSocket o nowe typy i inicjalizację capabilities | 
| PASS/black_box/łączność/battery szczegółowa | Pominięte | Prezentować stany PASS, rejestracji oraz jakości linków | 

## 6. Analiza ryzyk integracyjnych
- **Niezgodne progi środowiskowe** mogą generować fałszywe alarmy lub brak reakcji na krytyczne wartości (np. O₂ <18%).【F:docs/psp/02_SYMULATOR_API_v2.md†L780-L815】
- **Nieobsłużone eventy WebSocket** (`recco_detector`, `weather`, `welcome`) mogą powodować błędy parsera lub utratę funkcji (np. brak informacji o capabilities wersji symulatora).【F:docs/psp/02_SYMULATOR_API_v2.md†L118-L619】
- **Pominięte endpointy REST** (`incidents`, `recording/status`) zablokują spełnienie wymagań hackathonu dotyczących nagrywania i odtwarzania incydentów.【F:docs/psp/02_SYMULATOR_API_v2.md†L818-L879】
- **Alerty offline sprzętu** – bez obsługi `beacon_offline/tag_offline` UI może nie zasygnalizować utraty lokalizacji UWB, co jest krytyczne dla bezpieczeństwa.【F:docs/psp/02_SYMULATOR_API_v2.md†L654-L668】
- **Brak stanu RECCO** – utrata zgodności z wymaganiem pasywnej lokalizacji backup, potencjalna utrata punktów oceny.【F:docs/psp/05_TECHNOLOGIA_RECCO.md†L11-L24】

## 7. Plan wdrożenia poprawek
1) **Warstwa API** – rozszerzyć klienta REST o brakujące endpointy (health, recco, recording, incidents, history, beacons/:id) oraz WebSocket handler o nowe typy (welcome, recco_detector, weather, komendy sterujące).【F:docs/psp/02_SYMULATOR_API_v2.md†L118-L879】
2) **Modele i store** – dodać stany dla RECCO, pogodowe, nagrywania/replay, pełnych czujników środowiska, PASS/black_box, jakości łączności, hazard zones. Aktualizować selektory i hooki (`useEnvironment`, `useEquipment`, `useCommunication`, `useSimulationControl`).【F:docs/psp/02_SYMULATOR_API_v2.md†L223-L418】【F:docs/psp/02_SYMULATOR_API_v2.md†L780-L815】
3) **UI/UX** –
   - Environment: pełna tablica czujników + progi warning/critical.
   - Equipment: SCBA remaining time, alarmy, baterie, PASS, black_box.
   - Communications: stan NIB (LTE/LoRa/WiFi), emergency broadcast, capabilities z `welcome`.
   - BuildingMap: hazard zones, beacons zasięg, status offline.
   - Replay/Recording: panele do start/stop i listy `/incidents` z timeline.
4) **Alert routing** – zmapować wszystkie typy alertów na UI i logikę ACK/resolve; powiązać z globalnymi stanami (`environmental_hazard_active`, `equipment_hazard_active`, `emergency_broadcast_active`).【F:docs/psp/02_SYMULATOR_API_v2.md†L654-L719】
5) **Reguły progów** – wprowadzić dwustopniowe progi zgodne z tabelą środowiskową; zharmonizować z alertami API (np. high_temperature warning, explosive_gas critical).【F:docs/psp/02_SYMULATOR_API_v2.md†L780-L815】
6) **Testy integracyjne** – scenariusze: trigger_man_down, trigger_sos, beacon_offline, scba_refill, trigger_environment_hazard (każdy hazard_type), start/stop_recording, replay incident, recco_detector activation, weather update, brak telemetrii (tag_offline).【F:docs/psp/02_SYMULATOR_API_v2.md†L672-L719】【F:docs/psp/02_SYMULATOR_API_v2.md†L818-L879】

