# Pomysły na projekty hackathonowe

Jako uczestnik hackathonu HackNation 2025 – Zaprogramuj przyszłość Polski masz dostęp do bogatej telemetrii, którą możesz wykorzystać do budowy innowacyjnych rozwiązań dla straży pożarnej.

---

## Algorytmy pozycjonowania (Indoor Positioning)

### Własna trilateracja UWB
Masz `uwb_measurements` z `range_m`, `rssi_dbm`, `los`, `quality` - zbuduj algorytm lepszy niż wbudowany NLSE.
- Tag publikuje pomiary do WSZYSTKICH beaconów w zasięgu ≤15m
- Minimum 3 beacony wymagane do pozycjonowania
- Dane: `position.trilateration` zawiera wyniki wbudowanego algorytmu do porównania

### Fuzja sensorów
Połącz UWB + barometr + IMU dla dokładniejszej lokalizacji 3D:
- `uwb_measurements` - odległości do beaconów
- `barometer` - ciśnienie, estymacja piętra, prędkość pionowa
- `imu` - akcelerometr, żyroskop, magnetometr, orientacja
- `heading_deg` - kierunek ruchu

### Korekcja NLOS
Wykrywaj przeszkody i koryguj błędy pozycjonowania:
- `los` - czy jest bezpośrednia widoczność
- `nlos_probability` - prawdopodobieństwo przeszkody
- `quality` - jakość pomiaru (excellent/good/fair/poor)

---

## Systemy alarmowe i predykcja

### Predykcja zagrożeń
Analizuj trendy aby przewidzieć problemy:
- `vitals.heart_rate_bpm` - tętno (alarm >180)
- `vitals.stress_level` - poziom stresu (low/moderate/high/critical)
- `vitals.stationary_duration_s` - czas bezruchu (man-down po 30s)
- `scba.remaining_time_min` - pozostały czas tlenu

### Inteligentny PASS
Ulepsz system wykrywania bezruchu:
- `pass_status.status` - active/pre_alarm/alarm/disabled
- `pass_status.time_since_motion_s` - czas od ostatniego ruchu
- `imu.orientation` - orientacja ciała (roll/pitch/yaw)
- `imu.accel` - przyspieszenie (wykrywanie upadku)

### Optymalizacja ewakuacji
Śledź pozycje wszystkich strażaków i sugeruj najlepsze trasy:
- Pozycje wszystkich 6 strażaków w czasie rzeczywistym
- Pozycje stref zagrożenia z `building_config.hazard_zones`
- Lokalizacja klatek schodowych z `building_config.stairwells`

---

## Wizualizacja i analiza

### Dashboard dowodzenia
Lepsza wizualizacja dla KDR (Kierującego Działaniem Ratowniczym):
- Mapa 2D/3D z pozycjami strażaków
- Panel statusu każdego strażaka
- Historia alertów z `/api/v1/alerts`
- Status beaconów i bramki NIB

### Replay incydentów
Wykorzystaj Recording API do analizy po akcji:
- `POST /api/v1/simulation/control` z `action: "start_recording"`
- `GET /api/v1/incidents/:id/replay` - odtwarzanie danych
- `GET /api/v1/incidents/:id/firefighters/:ffId/timeline` - oś czasu strażaka

### Heatmapy zagrożeń
Mapuj dane środowiskowe w czasie rzeczywistym:
- `environment.co_ppm` - tlenek węgla
- `environment.o2_percent` - poziom tlenu
- `environment.lel_percent` - wybuchowość
- `environment.temperature_c` - temperatura

---

## Zarządzanie zasobami

### Optymalizacja SCBA
Przewiduj kiedy strażak musi wycofać się na wymianę butli:
- `scba.cylinder_pressure_bar` - aktualne ciśnienie
- `scba.consumption_rate_lpm` - tempo zużycia
- `scba.remaining_time_min` - estymowany pozostały czas
- Możesz wywołać `scba_refill` aby zasymulować wymianę

### Monitoring baterii
Alarmuj o niskim poziomie przed utratą łączności:
- `device.battery_percent` - poziom baterii tagu
- `vitals.hr_band_battery` - bateria paska HR
- `scba.battery_percent` - bateria SCBA

### Rotacja zespołów
Sugeruj zmiany na podstawie zmęczenia:
- `vitals.heart_rate_bpm` + `vitals.hr_zone` (rest/light/moderate/hard/maximum)
- `vitals.stress_level` - poziom stresu
- `vitals.calories_burned` - spalona energia
- Czas od wejścia do budynku

---

## Integracja i rozszerzenia

### Aplikacja mobilna
Dla strażaków poza budynkiem lub dowódcy w terenie

### AR/VR
Wizualizacja pozycji w rozszerzonej rzeczywistości

### Integracja z dronami
Koordynacja z zewnętrznym rozpoznaniem

### Voice alerts
Głosowe powiadomienia o krytycznych alarmach

---

## Dostępne dane

| Źródło | Częstotliwość | Opis |
|--------|---------------|------|
| `tag_telemetry` | 1 Hz | Pełna telemetria strażaka |
| `beacons_status` | 5s | Status 18 beaconów UWB |
| `nib_status` | 10s | Status bramki NIB |
| `weather` | 30s | Dane pogodowe |
| `alert` | event | Alarmy (man-down, SOS, itp.) |

**Symulator:** 6 strażaków, 18 beaconów UWB (zasięg 15m), pełne dane środowiskowe

**API daje Ci wszystko:** WebSocket real-time, REST do historii, nagrywanie incydentów

---

## Szybkie linki

- Frontend: https://niesmiertelnik.replit.app
- WebSocket: wss://niesmiertelnik.replit.app/ws
- REST API: https://niesmiertelnik.replit.app/api/v1/
- Pełna dokumentacja: `02_SYMULATOR_API_v2.md`

---

*Co Cię najbardziej interesuje? Wybierz jeden obszar i skup się na nim!*
