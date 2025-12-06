# Quick Start - Cyfrowy Nieśmiertelnik PSP v2.7
## Przewodnik szybkiego startu dla uczestników hackathonu
### HackNation 2025 | Pula nagród: 25 000 PLN

> **„Ratują innych, ryzykując własne życie. Czas, by technologia pomogła im w tym zadaniu. Stwórz rozwiązanie, które zwiększy bezpieczeństwo strażaków – nawet tam, gdzie nie ma sieci ani sygnału GPS."**

---

## TL;DR (dla niecierpliwych)

```
Frontend:   https://niesmiertelnik.replit.app
WebSocket:  wss://niesmiertelnik.replit.app/ws
REST API:   https://niesmiertelnik.replit.app/api/v1/
```

> **HackNation 2025:** przed prezentacją upewnij się, że zespół spełnia formalności (regulaminy, zgody na wizerunek, przeniesienie praw autorskich). Wszystkie materiały są w `FORMALNO_PRAWNE_HACKNATION.md`.

---

## Krok po kroku

### Krok 1: Wymagania

**Potrzebujesz:**
- Przeglądarka (Chrome/Firefox/Edge)
- Edytor kodu (VS Code, WebStorm, itp.)
- Opcjonalnie: Node.js 18+ do własnego frontendu

---

### Krok 2: Połącz się z symulatorem

**Publiczny serwer:**
```
Frontend:   https://niesmiertelnik.replit.app
WebSocket:  wss://niesmiertelnik.replit.app/ws
REST API:   https://niesmiertelnik.replit.app/api/v1/
```

---

### Krok 3: Sprawdź czy działa

**W przeglądarce:**
- Otwórz `https://niesmiertelnik.replit.app`
- Powinieneś zobaczyć mapę z poruszającymi się strażakami

**Sprawdź API:**
```bash
# Status serwera
curl https://niesmiertelnik.replit.app/api/v1/health

# Lista strażaków
curl https://niesmiertelnik.replit.app/api/v1/firefighters

# Lista beaconów
curl https://niesmiertelnik.replit.app/api/v1/beacons
```

**W konsoli przeglądarki (WebSocket):**
```javascript
// Otwórz DevTools (F12) → Console
const ws = new WebSocket('wss://niesmiertelnik.replit.app/ws');

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.type === 'tag_telemetry') {
    console.log(`${data.firefighter.name}: x=${data.position.x.toFixed(1)}, y=${data.position.y.toFixed(1)}, floor=${data.position.floor}`);
  }
};

// Po chwili zobaczysz pozycje strażaków aktualizujące się co 1s
```

---

### Krok 4: Wywołaj testowy alarm

**Przez WebSocket:**
```javascript
// W konsoli przeglądarki (po połączeniu ws)
ws.send(JSON.stringify({ command: 'trigger_man_down', firefighter_id: 'FF-003' }));
```

**Przez REST API (publiczny serwer):**
```bash
curl -X POST https://niesmiertelnik.replit.app/api/v1/simulation/control \
  -H "Content-Type: application/json" \
  -d '{"action": "trigger_man_down", "params": {"firefighter_id": "FF-003"}}'
```

Powinieneś zobaczyć:
- Alert "MAN-DOWN" w aplikacji
- Marker strażaka zmienia kolor/pulsuje
- Powiadomienie w panelu alarmów

**Inne komendy testowe:**
```bash
# SOS
curl -X POST https://niesmiertelnik.replit.app/api/v1/simulation/control \
  -H "Content-Type: application/json" \
  -d '{"action": "trigger_sos", "params": {"firefighter_id": "FF-002"}}'

# Wyłącz beacon
curl -X POST https://niesmiertelnik.replit.app/api/v1/simulation/control \
  -H "Content-Type: application/json" \
  -d '{"action": "beacon_offline", "params": {"beacon_id": "BCN-002"}}'

# Reset symulacji
curl -X POST https://niesmiertelnik.replit.app/api/v1/simulation/control \
  -H "Content-Type: application/json" \
  -d '{"action": "reset"}'
```

---

## Struktura projektu

```
.
├── client/                  # Frontend React
│   ├── src/
│   │   ├── components/      # Komponenty UI (shadcn/ui)
│   │   ├── hooks/           # useSimulator.ts - główny hook WebSocket
│   │   ├── pages/           # Dashboard.tsx - główny widok
│   │   └── lib/             # Utilities
│   └── index.html
│
├── server/                  # Backend Express
│   ├── index.ts             # Serwer HTTP/WebSocket
│   ├── routes.ts            # API + logika symulacji (~2800 linii)
│   ├── db.ts                # PostgreSQL (Neon)
│   └── telemetry-recorder.ts # Nagrywanie incydentów
│
├── shared/                  # Współdzielone typy
│   └── schema.ts            # Zod schemas + DB tables
│
└── doc_hack/                # Dokumentacja hackathonu
    ├── README.md                 # Przegląd pakietu
    ├── 01_KARTA_WYZWANIA_v2.md
    ├── 02_SYMULATOR_API_v2.md    # Dokumentacja API
    ├── 03_KONCEPCJA_HW_WYTYCZNE.md
    ├── 04_QUICK_START.md         # Ten plik
    ├── 05_TECHNOLOGIA_RECCO.md
    ├── EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md
    ├── FORMALNO_PRAWNE_HACKNATION.md
    └── IDEAS.md                  # Pomysły na projekty
```

---

## Strażacy w symulacji

System symuluje **6 strażaków** z różnymi rolami:

| ID | Imię | Stopień | Rola | Zespół |
|----|------|---------|------|--------|
| FF-001 | Jan Kowalski | asp. sztab. | Dowódca roty | Rota 1 |
| FF-002 | Piotr Nowak | ogn. | Przodownik | Rota 1 |
| FF-003 | Anna Wiśniewska | st. ogn. | Ratownik | Rota 1 |
| FF-004 | Tomasz Zieliński | mł. ogn. | Ratownik | Rota 1 |
| FF-005 | Marek Kamiński | sekc. | Kierowca-operator | Rota 1 |
| FF-006 | Katarzyna Dąbrowska | asp. | Dowódca sekcji RIT | RIT |

---

## Budynek szkoleniowy

```
Wymiary: 40m × 25m × 12m
GPS Reference: 52.2297°N, 21.0122°E (Warszawa)

Piętra:
  -1: Piwnica (kotłownia - strefa niebezpieczna)
   0: Parter (wejścia, magazyn chemiczny)
   1: 1. piętro
   2: 2. piętro

Wejścia:
  - Główne (x=0, y=5) - parter
  - Boczne (x=40, y=20) - parter
  - Techniczne (x=20, y=25) - piwnica

Klatka schodowa: (x=35, y=20) - wszystkie piętra
```

---

## Kluczowe dane z API

### Pozycja strażaka (co 1s z tag_telemetry)
```javascript
const pos = data.position;
console.log(`X: ${pos.x}m, Y: ${pos.y}m, Z: ${pos.z}m`);
console.log(`Piętro: ${pos.floor}`);
console.log(`Pewność: ${pos.confidence * 100}%`);
console.log(`Źródło: ${pos.source}`); // uwb_fusion, imu_only, gps
console.log(`Beaconów: ${pos.beacons_used}`);
```

### Parametry życiowe
```javascript
const vitals = data.vitals;
console.log(`HR: ${vitals.heart_rate_bpm} bpm`);
console.log(`Stan: ${vitals.motion_state}`); // walking, running, stationary, fallen, climbing
console.log(`Stres: ${vitals.stress_level}`); // low, moderate, high, critical
console.log(`Kroki: ${vitals.step_count}`);
```

### SCBA (aparat powietrzny)
```javascript
const scba = data.scba;
console.log(`Ciśnienie: ${scba.cylinder_pressure_bar} / ${scba.max_pressure_bar} bar`);
console.log(`Pozostało: ${scba.remaining_time_min} min`);
console.log(`Alarm: ${scba.alarm_low_pressure}`);
```

### Odległości UWB do beaconów
```javascript
// uwb_measurements zawiera WSZYSTKIE beacony w zasięgu ≤15m (min. 3 do pozycjonowania)
if (data.uwb_measurements) {
  console.log(`Beaconów w zasięgu: ${data.uwb_measurements.length}`);
  data.uwb_measurements.forEach(m => {
    console.log(`${m.beacon_name}: ${m.range_m.toFixed(2)}m (quality: ${m.quality})`);
  });
}

// Przykładowe dane (strażak w centrum budynku):
// Beaconów w zasięgu: 4
// Hol - centrum: 2.15m (quality: excellent)
// Wejście główne: 8.23m (quality: excellent)
// Centrum - północ: 10.82m (quality: good)
// Korytarz północny: 12.05m (quality: good)
```

### PASS (Personal Alert Safety System)
```javascript
const pass = data.pass_status;
console.log(`Status: ${pass.status}`);           // active, pre_alarm, alarm, disabled
console.log(`Czas bezruchu: ${pass.time_since_motion_s}s`);
console.log(`Próg alarmu: ${pass.alarm_threshold_s}s`);  // domyślnie 30s
console.log(`Alarm aktywny: ${pass.alarm_active}`);
```

### Barometr (określanie piętra)
```javascript
const baro = data.barometer;
console.log(`Ciśnienie: ${baro.pressure_pa} Pa`);
console.log(`Wysokość rel.: ${baro.altitude_rel_m} m`);
console.log(`Piętro (estymowane): ${baro.estimated_floor}`);
console.log(`Pewność piętra: ${baro.floor_confidence_percent}%`);
```

### Czujniki środowiskowe
```javascript
const env = data.environment;
console.log(`CO: ${env.co_ppm} ppm`);       // Tlenek węgla (alarm >100)
console.log(`O2: ${env.o2_percent}%`);      // Tlen (alarm <19.5%)
console.log(`LEL: ${env.lel_percent}%`);    // Wybuchowość (alarm >10%)
console.log(`Temp: ${env.temperature_c}°C`);
```

---

## Minimalny przykład - własna aplikacja

### Vanilla JavaScript
```html
<!DOCTYPE html>
<html>
<head>
  <title>Nieśmiertelnik - Mapa</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    #map { height: 600px; width: 100%; }
    #status { padding: 10px; background: #1a1a2e; color: #16c784; }
    .ff-marker { background: #3b82f6; border: 2px solid white; border-radius: 50%; }
    .alert { background: #ef4444 !important; animation: pulse 1s infinite; }
    @keyframes pulse { 50% { opacity: 0.5; } }
  </style>
</head>
<body>
  <div id="status">Łączenie...</div>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const GPS_ORIGIN = { lat: 52.2297, lon: 21.0122 };
    const map = L.map('map').setView([GPS_ORIGIN.lat, GPS_ORIGIN.lon], 19);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const markers = new Map();
    const ws = new WebSocket('wss://niesmiertelnik.replit.app/ws');

    ws.onopen = () => {
      document.getElementById('status').textContent = '🟢 Połączono';
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'tag_telemetry') {
        const { firefighter, position, vitals } = data;
        const lat = GPS_ORIGIN.lat + (position.y / 111320);
        const lon = GPS_ORIGIN.lon + (position.x / 71695);

        if (!markers.has(firefighter.id)) {
          const icon = L.divIcon({
            className: 'ff-marker',
            html: `<div style="width:20px;height:20px;line-height:20px;text-align:center;color:white;font-size:10px;">${firefighter.name.charAt(0)}</div>`,
            iconSize: [20, 20]
          });
          markers.set(firefighter.id, L.marker([lat, lon], { icon }).addTo(map));
        } else {
          markers.get(firefighter.id).setLatLng([lat, lon]);
        }

        markers.get(firefighter.id).bindTooltip(`
          <b>${firefighter.name}</b><br>
          HR: ${vitals.heart_rate_bpm} bpm<br>
          Piętro: ${position.floor}<br>
          Stan: ${vitals.motion_state}
        `);
      }

      if (data.type === 'alert') {
        const marker = markers.get(data.firefighter?.id);
        if (marker) marker.getElement()?.classList.add('alert');
        alert(`ALERT: ${data.alert_type} - ${data.firefighter?.name}`);
      }
    };

    ws.onclose = () => {
      document.getElementById('status').textContent = '🔴 Rozłączono';
    };
  </script>
</body>
</html>
```

---

## Rozwiązywanie problemów

### WebSocket nie łączy
1. Sprawdź URL: `wss://niesmiertelnik.replit.app/ws` (wss://, nie ws://)
2. Otwórz DevTools → Network → WS i sprawdź połączenie
3. Upewnij się, że przeglądarka nie blokuje połączeń

### Brak danych
1. Sprawdź konsolę na błędy JavaScript
2. Sprawdź czy symulacja działa:
```bash
curl https://niesmiertelnik.replit.app/api/v1/health
# simulation_running powinno być true
```

### Reset symulacji
```bash
curl -X POST https://niesmiertelnik.replit.app/api/v1/simulation/control \
  -H "Content-Type: application/json" \
  -d '{"action": "reset"}'
```

---

## Checklist MVP

### Wymagane (60 punktów):
- [ ] Mapa 2D budynku z pozycjami strażaków (15 pkt)
- [ ] Wskaźnik piętra dla każdego strażaka (5 pkt)
- [ ] Panel parametrów: tętno, bateria, stan ruchu (10 pkt)
- [ ] Alarm MAN-DOWN (automatyczny po 30s bezruchu) (10 pkt)
- [ ] Status beaconów na mapie (5 pkt)
- [ ] Dokumentacja HW tagu nieśmiertelnika (10 pkt)
- [ ] Dokumentacja HW beacona UWB (5 pkt)

### Dodatkowe (25 punktów):
- [ ] Algorytm fuzji danych (EKF/UKF) (8 pkt)
- [ ] Wizualizacja 3D (Three.js) (7 pkt)
- [ ] Historia trajektorii (5 pkt)
- [ ] Dokumentacja bramki NIB (5 pkt)

### Bonus (15 punktów):
- [ ] Procedura RECCO - UI dla RIT (5 pkt)
- [ ] Symulacja czarnej skrzynki (5 pkt)
- [ ] Integracja z mapami OSM/BIM (3 pkt)
- [ ] Voice alerts (2 pkt)

---

## Harmonogram oficjalny HackNation 2025

### Sobota, 6 grudnia 2025
| Czas | Wydarzenie |
|------|------------|
| 10:30 | Ceremonia otwarcia |
| 11:00 | **START KODOWANIA** |

### Niedziela, 7 grudnia 2025
| Czas | Wydarzenie |
|------|------------|
| 11:00 | **KONIEC KODOWANIA** |
| 15:30 | Prezentacje projektów |
| 17:45 | Ceremonia zamknięcia |

### Sugerowany plan pracy (24h)

| Czas | Zadanie | Cel |
|------|---------|-----|
| 11:00-13:00 | Setup + zapoznanie | Symulator działa, API rozumiane |
| 13:00-15:00 | Mapa 2D + markery | Strażacy widoczni na mapie |
| 15:00-17:00 | Panel parametrów | HR, bateria, status widoczne |
| 17:00 | **CHECKPOINT 1** | Demo: podstawowa wizualizacja |
| 17:00-19:00 | Alarmy | Man-down działa i jest widoczny |
| 19:00-21:00 | Beacony | Status beaconów na mapie |
| 21:00-23:00 | **CHECKPOINT 2** | Demo: MVP kompletne |
| 23:00-03:00 | Dokumentacja HW | Schemat + BOM dla tagu |
| 03:00-05:00 | **CHECKPOINT 3** | Demo: HW docs gotowe |
| 05:00-07:00 | Polish | UI, testy, edge cases |
| 07:00-09:00 | Bonus features | 3D, historia, RECCO |
| 09:00 | **CODE FREEZE** | Ostatni commit |
| 09:00-11:00 | Prezentacja | Przygotowanie slajdów, demo |

---

## 🔗 Powiązane dokumenty

| Dokument | Opis |
|----------|------|
| `README.md` | Przegląd pakietu dokumentacji |
| `01_KARTA_WYZWANIA_v2.md` | Oficjalna karta wyzwania |
| `02_SYMULATOR_API_v2.md` | Pełna dokumentacja API symulatora |
| `03_KONCEPCJA_HW_WYTYCZNE.md` | Wytyczne do dokumentacji hardware |
| `05_TECHNOLOGIA_RECCO.md` | System backup lokalizacji RECCO |
| `EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md` | Szczegółowa specyfikacja urządzeń |
| `FORMALNO_PRAWNE_HACKNATION.md` | Formalności i zgody HackNation |

---

## Pomoc

- **Strona wydarzenia:** https://hacknation.pl/
- **Dokumentacja API:** `02_SYMULATOR_API_v2.md`
- **Discord:** https://discord.com/invite/Kn7mhgVqHV
- **Mentor wyzwania:** Michał Kłosiński - KG PSP

**Nie bój się pytać!** Lepiej zapytać i iść dalej niż tkwić w miejscu.

---

**Powodzenia! Wasz system może uratować życie strażaka.**

---

*Quick Start Guide - Cyfrowy Nieśmiertelnik PSP v2.7*
*HackNation 2025 - Grudzień 2025*
