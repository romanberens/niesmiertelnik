# Cyfrowy Nieśmiertelnik PSP v2.7
## Kompletny pakiet wyzwania hackathonowego

> **„Ratują innych, ryzykując własne życie. Czas, by technologia pomogła im w tym zadaniu. Stwórz rozwiązanie, które zwiększy bezpieczeństwo strażaków – nawet tam, gdzie nie ma sieci ani sygnału GPS."**

**Pula nagród: 25 000 PLN**

**HackNation 2025** — 06–07.12.2025, Bydgoskie Centrum Targowo-Wystawiennicze (ul. Gdańska 187, Bydgoszcz).

**Symulator:** https://niesmiertelnik.replit.app

**Dokumentacja API:** https://niesmiertelnikcyfrowy-admin810.replit.app

**Strona Wydarzenia:** https://hacknation.pl

Materiały formalne i zgody: `FORMALNO_PRAWNE_HACKNATION.md`

---

## Zawartość pakietu

```
doc_hack/
│
├── README.md                       # Ten plik
├── 01_KARTA_WYZWANIA_v2.md         # Oficjalna karta wyzwania HackNation 2025 – Zaprogramuj przyszłość Polski
├── 02_SYMULATOR_API_v2.md          # Dokumentacja API symulatora
├── 03_KONCEPCJA_HW_WYTYCZNE.md     # Jak dokumentować hardware
├── 04_QUICK_START.md               # Przewodnik szybkiego startu
├── 05_TECHNOLOGIA_RECCO.md         # Dokumentacja systemu RECCO (przykładowa)
├── EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md  # Szczegółowa dokumentacja urządzeń
├── FORMALNO_PRAWNE_HACKNATION.md   # Formalności i zgody HackNation
└── IDEAS.md                        # Pomysły na projekty
```

---

## Szybki start

### 1. Połącz się z symulatorem

```
Frontend:   https://niesmiertelnik.replit.app
WebSocket:  wss://niesmiertelnik.replit.app/ws
REST API:   https://niesmiertelnik.replit.app/api/v1/
```

### 2. Sprawdź API

```bash
# Status serwera
curl https://niesmiertelnik.replit.app/api/v1/health

# Lista strażaków
curl https://niesmiertelnik.replit.app/api/v1/firefighters

# Lista beaconów
curl https://niesmiertelnik.replit.app/api/v1/beacons

# Status aparatów SCBA
curl https://niesmiertelnik.replit.app/api/v1/scba

# Dane pogodowe
curl https://niesmiertelnik.replit.app/api/v1/weather
```

### 3. Przetestuj alarmy

```bash
# Man-down
curl -X POST https://niesmiertelnik.replit.app/api/v1/simulation/control \
  -H "Content-Type: application/json" \
  -d '{"action": "trigger_man_down", "params": {"firefighter_id": "FF-003"}}'

# SOS
curl -X POST https://niesmiertelnik.replit.app/api/v1/simulation/control \
  -H "Content-Type: application/json" \
  -d '{"action": "trigger_sos", "params": {"firefighter_id": "FF-002"}}'

# Zagrożenie środowiskowe (CO)
curl -X POST https://niesmiertelnik.replit.app/api/v1/simulation/control \
  -H "Content-Type: application/json" \
  -d '{"action": "trigger_environment_hazard", "params": {"firefighter_id": "FF-001", "hazard_type": "high_co"}}'
```

---

## Formalności HackNation

- Podsumowanie formalno-prawne i wymagane formularze: `FORMALNO_PRAWNE_HACKNATION.md`
- Kluczowe pliki: regulaminy HackNation, wzór umowy przeniesienia praw autorskich, zgody na wizerunek
- Upewnij się, że zespół posiada podpisane zgody przed prezentacją

---

## Ekosystem urządzeń

Wyzwanie obejmuje **6 typów urządzeń**:

| # | Urządzenie | Opis | Dokumentacja |
|---|------------|------|--------------|
| 1 | **Tag Nieśmiertelnik** | Urządzenie noszone przez strażaka (UWB+IMU+LoRa+LTE+GNSS+BLE+Środowisko) | EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md §2 |
| 2 | **Beacon UWB** | Kotwica pozycyjna rozstawiana w budynku (18 szt. w symulacji) | EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md §3 |
| 3 | **Bramka NIB** | Koncentrator sieciowy w pojeździe | EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md §4 |
| 4 | **Pasek HR** | Monitor tętna BLE | EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md §5 |
| 5 | **Reflektor RECCO** | Pasywny element lokalizacyjny (przykładowa technologia) | 05_TECHNOLOGIA_RECCO.md |
| 6 | **Detektor RECCO** | Urządzenie poszukiwawcze (przykładowa technologia) | 05_TECHNOLOGIA_RECCO.md |

### Architektura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    TAG      │◄───►│   BEACON    │     │   BRAMKA    │
│ (strażak)   │ UWB │    UWB      │     │    NIB      │
│             │     │  (15m max)  │     │  (pojazd)   │
│ UWB+IMU+    │     └─────────────┘     │             │
│ LoRa+LTE+   │──────────LoRa──────────►│ LoRa+LTE+   │
│ GNSS+BLE    │                         │ WiFi+GPS    │
└──────┬──────┘                         └──────┬──────┘
       │ BLE                                   │ LTE/5G
       ▼                                       ▼
┌─────────────┐                         ┌─────────────┐
│  PASEK HR   │                         │   CHMURA    │
│   (BLE)     │                         │    PSP      │
└─────────────┘                         └─────────────┘

═══════════════ BACKUP PASYWNY ═══════════════

┌─────────────┐     ┌─────────────┐
│  REFLEKTOR  │◄───►│  DETEKTOR   │
│   RECCO     │radar│   RECCO     │
│ (w mundurze)│     │  (ręczny)   │
└─────────────┘     └─────────────┘
```

---

## API Symulatora v2.7

### WebSocket

**Połączenie:** `wss://niesmiertelnik.replit.app/ws`

**Wiadomości przychodzące:**

| Typ | Częstotliwość | Opis |
|-----|---------------|------|
| `welcome` | Jednorazowo | Powitanie, wersja symulatora, capabilities |
| `building_config` | Jednorazowo | Konfiguracja budynku (piętra, strefy) |
| `beacons_config` | Jednorazowo | Lista beaconów UWB |
| `firefighters_list` | Jednorazowo | Lista strażaków |
| `recco_detector` | Jednorazowo | Status detektora RECCO |
| `tag_telemetry` | 1 Hz | Pełna telemetria strażaka |
| `beacons_status` | 5s | Status beaconów |
| `nib_status` | 10s | Status bramki NIB |
| `weather` | 30s | Dane pogodowe |
| `alert` | Event | Alarm (man-down, SOS, itp.) |

**Komendy:**

```javascript
// Wywołaj man-down
ws.send(JSON.stringify({ command: "trigger_man_down", firefighter_id: "FF-003" }));

// Wywołaj SOS
ws.send(JSON.stringify({ command: "trigger_sos", firefighter_id: "FF-002" }));

// Wyłącz beacon
ws.send(JSON.stringify({ command: "beacon_offline", beacon_id: "BCN-002" }));

// Uzupełnij SCBA
ws.send(JSON.stringify({ command: "scba_refill", firefighter_id: "FF-001" }));

// Potwierdź alarm
ws.send(JSON.stringify({ command: "acknowledge_alert", alert_id: "ALERT-xxx", acknowledged_by: "Dowódca" }));

// Reset symulacji
ws.send(JSON.stringify({ command: "reset" }));

// Pauza/wznowienie
ws.send(JSON.stringify({ command: "pause" }));

// Zmiana prędkości (0.1 - 10x)
ws.send(JSON.stringify({ command: "set_speed", speed: 2.0 }));

// Pobierz historię pozycji
ws.send(JSON.stringify({ command: "get_history", firefighter_id: "FF-001", limit: 60 }));
```

### REST API

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/v1/health` | GET | Status serwera i symulacji |
| `/api/v1/building` | GET | Konfiguracja budynku |
| `/api/v1/beacons` | GET | Lista beaconów |
| `/api/v1/beacons/:id` | GET | Szczegóły beacona |
| `/api/v1/firefighters` | GET | Lista strażaków |
| `/api/v1/firefighters/:id` | GET | Pełna telemetria strażaka |
| `/api/v1/firefighters/:id/history` | GET | Historia pozycji (max 300) |
| `/api/v1/nib` | GET | Status bramki NIB |
| `/api/v1/scba` | GET | Status aparatów powietrznych |
| `/api/v1/recco` | GET | Status systemu RECCO |
| `/api/v1/weather` | GET | Dane pogodowe |
| `/api/v1/alerts` | GET | Lista alarmów (?active=true) |
| `/api/v1/simulation/control` | POST | Sterowanie symulacją |
| `/api/v1/recording/status` | GET | Status nagrywania |
| `/api/v1/incidents` | GET | Lista nagranych incydentów |
| `/api/v1/incidents/:id` | GET | Szczegóły incydentu |
| `/api/v1/incidents/:id/replay` | GET | Odtwarzanie incydentu |
| `/api/v1/incidents/:id/firefighters/:ffId/timeline` | GET | Oś czasu strażaka |
| `/api/v1/incidents/:id` | DELETE | Usuń incydent |

Pełna dokumentacja API: `02_SYMULATOR_API_v2.md`

---

## Szacowany poziom trudności

| Zadanie | Trudność | Czas |
|---------|----------|------|
| Połączenie z API | * | 1h |
| Mapa 2D z markerami | ** | 3-4h |
| Panel parametrów | ** | 2-3h |
| Status beaconów | ** | 2h |
| Alarm man-down | ** | 2h |
| Dokumentacja HW | *** | 4-6h |
| Algorytm fuzji (EKF) | **** | 6-10h |
| Wizualizacja 3D | **** | 8-12h |

**MVP:** ~12-16 godzin dla zespołu 3-4 osób

---

## Dane z symulacji

### Strażacy (6 osób)
| ID | Imię | Stopień | Rola | Zespół |
|----|------|---------|------|--------|
| FF-001 | Jan Kowalski | asp. sztab. | Dowódca roty | Rota 1 |
| FF-002 | Piotr Nowak | ogn. | Przodownik | Rota 1 |
| FF-003 | Anna Wiśniewska | st. ogn. | Ratownik | Rota 1 |
| FF-004 | Tomasz Zieliński | mł. ogn. | Ratownik | Rota 1 |
| FF-005 | Marek Kamiński | sekc. | Kierowca-operator | Rota 1 |
| FF-006 | Katarzyna Dąbrowska | asp. | Dowódca sekcji RIT | RIT |

### Beacony UWB (18 szt.)

| ID | Nazwa | Pozycja (x,y,z) | Piętro | Typ |
|----|-------|-----------------|--------|-----|
| BCN-B01 | Piwnica - wejście | (20, 24, -3.0) | -1 | anchor |
| BCN-B02 | Piwnica - kotłownia | (7, 6, -3.0) | -1 | hazard |
| BCN-001 | Wejście główne | (2, 5, 0) | 0 | entry |
| BCN-002 | Hol - centrum | (10, 5, 0) | 0 | anchor |
| BCN-003 | Korytarz północny | (20, 11, 0) | 0 | anchor |
| BCN-004 | Sala konferencyjna | (10, 19, 0) | 0 | anchor |
| BCN-005 | Klatka schodowa - parter | (35, 19, 0) | 0 | stairs |
| BCN-006 | Wejście boczne | (38, 20, 0) | 0 | entry |
| BCN-101 | Open space - północ | (10, 5, 3.2) | 1 | anchor |
| BCN-102 | Open space - południe | (10, 12, 3.2) | 1 | anchor |
| BCN-103 | Sala szkoleń | (35, 7, 3.2) | 1 | anchor |
| BCN-104 | Klatka schodowa - 1p | (35, 21, 3.2) | 1 | stairs |
| BCN-201 | Sala A | (10, 6, 6.4) | 2 | anchor |
| BCN-202 | Sala B | (30, 6, 6.4) | 2 | anchor |
| BCN-203 | Laboratorium | (12, 20, 6.4) | 2 | anchor |
| BCN-007 | Centrum - północ | (20, 5, 0) | 0 | anchor |
| BCN-008 | Centrum - południe | (20, 18, 0) | 0 | anchor |
| BCN-105 | Open space - centrum | (20, 10, 3.2) | 1 | anchor |

**Maksymalny zasięg beacona:** 15m

### Budynek szkoleniowy
- Wymiary: 40m × 25m × 12m
- Piętra: -1 (Piwnica), 0 (Parter), 1, 2
- GPS: 52.2297°N, 21.0122°E (Warszawa)
- Strefy niebezpieczne: Kotłownia (piwnica), Magazyn chemiczny (parter)

---

## Kluczowe funkcje symulatora v2.7

### Systemy symulowane

| System | Opis | Dane w API |
|--------|------|------------|
| **UWB Positioning** | Trilateracja NLSE z filtrem Kalmana, zasięg 15m | `position`, `uwb_measurements`, `trilateration` |
| **IMU** | Akcelerometr, żyroskop, magnetometr, orientacja | `imu` |
| **Barometr** | Ciśnienie, estymacja piętra | `barometer` |
| **GPS** | Konwersja lokalnych współrzędnych na GPS | `position.gps` |
| **Vitals** | Tętno, stres, stan ruchu, kroki | `vitals` |
| **SCBA** | Aparat powietrzny - ciśnienie, zużycie, alarmy | `scba` |
| **PASS** | System wykrywania bezruchu | `pass_status` |
| **Environment** | CO, CO2, O2, LEL, temperatura, wilgotność | `environment` (w telemetrii) |
| **RECCO** | System lokalizacji pasywnej | `recco` |
| **Black Box** | Rejestracja danych | `black_box` |
| **Weather** | Stacja pogodowa na pojeździe | `/api/v1/weather` |
| **Recording** | Nagrywanie i odtwarzanie incydentów | `/api/v1/recording/*`, `/api/v1/incidents/*` |

### Typy alertów

| Typ | Severity | Opis |
|-----|----------|------|
| `man_down` | critical | Bezruch >30s |
| `sos_pressed` | critical | Naciśnięty przycisk SOS |
| `high_heart_rate` | warning | Tętno >180 bpm |
| `low_battery` | warning | Bateria <20% |
| `scba_low_pressure` | warning | Ciśnienie SCBA niskie (<60 bar) |
| `scba_critical` | critical | Ciśnienie SCBA krytyczne (<30 bar) |
| `beacon_offline` | warning | Beacon nie odpowiada |
| `tag_offline` | critical | Tag strażaka nie odpowiada |
| `high_temperature` | warning | Wysoka temperatura otoczenia (>60°C) |
| `high_co` | critical | Wysokie stężenie CO (>100 ppm) |
| `low_oxygen` | critical | Niski poziom tlenu (<18%) |
| `explosive_gas` | critical | Wykryto gaz wybuchowy (LEL >25%) |

---

## Kontakt

- **Strona wydarzenia:** https://hacknation.pl/
- **Discord:** https://discord.com/invite/Kn7mhgVqHV
- **Mentor wyzwania:** Michał Kłosiński - KG PSP

---

## Powiązane dokumenty

| Dokument | Opis |
|----------|------|
| `01_KARTA_WYZWANIA_v2.md` | Oficjalna karta wyzwania HackNation 2025 – Zaprogramuj przyszłość Polski |
| `02_SYMULATOR_API_v2.md` | Pełna dokumentacja API symulatora |
| `03_KONCEPCJA_HW_WYTYCZNE.md` | Wytyczne do dokumentacji hardware |
| `04_QUICK_START.md` | Szybki start dla uczestników |
| `05_TECHNOLOGIA_RECCO.md` | System backup lokalizacji RECCO (przykładowa technologia) |
| `EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md` | Szczegółowa specyfikacja urządzeń |
| `FORMALNO_PRAWNE_HACKNATION.md` | Formalności i zgody HackNation |
| `IDEAS.md` | Pomysły na projekty hackathonowe |

---

## Licencja

Dokumentacja i kod udostępnione na potrzeby hackathonu HackNation 2025.
Prawa autorskie: Komenda Główna Państwowej Straży Pożarnej, Biuro Informatyki i Łączności.

---

*Wersja 2.7 – Pełny ekosystem urządzeń z symulatorem zintegrowanym*
*HackNation 2025 – Grudzień 2025*
