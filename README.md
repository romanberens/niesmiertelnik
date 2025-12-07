
# 📘 Cyfrowy Nieśmiertelnik – Dokumentacja Projektu

Cyfrowy Nieśmiertelnik to system wspierający działania dowódców PSP, umożliwiający:

-   wizualizację sytuacji na obiekcie szkoleniowym,
    
-   monitorowanie ratowników,
    
-   odbiór danych telemetrycznych z czujników osobistych,
    
-   przegląd alertów i statusów beaconów,
    
-   dynamiczną aktualizację interfejsu na podstawie danych z API oraz WebSocketów.
    

Projekt zawiera **backend Node.js** oraz **frontend w React + Vite + Tailwind**, współpracujące poprzez **WebSocket** oraz API HTTP.

----------

# 🚀 Aktualny Stan Projektu (07.12.2025)

Projekt jest w wersji **działającej**, ale na poziomie **szkieletu funkcjonalnego z aktywną integracją danych live**.

### ✔ Gotowe elementy:

-   Backend Node.js z:
    
    -   serwerem HTTP,
        
    -   pełnym wsparciem WebSocket (w tym broadcast do frontendów),
        
    -   połączeniem z upstream PSP API (Replit WS),
        
    -   parserem danych (`tag_telemetry`, `alert`, `beacons_status`, `building_config`),
        
    -   utrzymaniem stanu (`state.js`),
        
    -   API proxy dla danych budynku.
        
-   Frontend React:
    
    -   routing,
        
    -   główna scena **CommandCenter**,
        
    -   odbiór danych telemetrycznych,
        
    -   odbiór alertów, statusów beaconów i konfiguracji budynku,
        
    -   integracja WebSocket (automatyczne reconnecty),
        
    -   komplet store’ów (telemetry, alerts, building),
        
    -   ogólny układ UI zgodny z wymaganiami.
        
-   Integracja z API Replit (symulator PSP)
    
-   Udane połączenie WebSocket backend → frontend → PSP
    
-   Debug-tool w konsoli (`telemetryStore`, `buildingStore`, „lastEvents”)
    

### ❗ Wyzwania, które wystąpiły w trakcie:

Projekt przechodził kilka iteracji integracji:

-   WebSocket zadziałał, ale późniejsza reorganizacja plików frontendowych spowodowała utratę części widoków (szczególnie MapCanvas).
    
-   Widok CommandCenter nie renderuje pełnej sceny mapy, ponieważ komponent MapCanvas został zminimalizowany i wymaga odbudowy.
    
-   Dane `building_config` są odbierane, ale nie renderowane (brak mapy, brak wizualizacji kondygnacji).
    
-   Projekt był rozwijany szybko i przede wszystkim **na żywym organizmie**, aby poczynić jak największy postęp przed hackathonem.
    

### ❗ Wnioski:

-   Mamy **działającą komunikację**, pełen **strumień danych**, działające **store’y**, czyli „silnik” projektu.
    
-   Brakuje **warstwy prezentacji** (mapa, UI docelowy).
    
-   Projekt wymaga teraz **odtworzenia widoków z Figma / symulatora PSP**, ale fundamenty są gotowe.
    

----------

# 🧱 Architektura

`┌───────────────────────┐
│  Symulator PSP (Replit)│  <-- WebSocket →  niesmiertelnik/backend/ws-client
└───────────┬────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│           Backend Node.js               │
│  HTTP API /api/*                        │
│  WebSocket server ws://host:3001/ws     │
│  state.js – pamięć operacyjna           │
│  broadcast danych do frontendów         │
└───────────┬─────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│      Frontend React + Vite              │
│  WebSocket → ws://host:3001/ws          │
│  store: telemetry, building, alerts      │
│  widoki: CommandCenter, UI PSP           │
└─────────────────────────────────────────┘` 

----------

# 📦 Uruchomienie projektu lokalnie

### 1. Backend

`cd backend
npm install
node server.js` 

Serwer startuje na:

`http://localhost:3001
ws://localhost:3001/ws` 

### 2. Frontend

`pnpm install
pnpm run dev` 

Domyślnie:

`http://localhost:5173` 

----------

# 🌐 WebSocket – pełen przepływ danych

Backend nasłuchuje streamu:

`wss://niesmiertelnik.replit.app/ws` 

i przekazuje dane do frontendu:

Typ eventu

Działanie

`tag_telemetry`

aktualizacja statusu ratownika

`alert`

alert jednorazowy

`alerts`

wiele alertów

`beacons_status`

status beaconów w budynku

`building_config`

struktura budynku + kondygnacje

Front odbiera dane → store → UI.

----------

# 🖥️ Widoki i komponenty

### Gotowe:

-   AlertBanner
    
-   FloorSelector
    
-   StatusBadge
    
-   FirefighterCard
    
-   SensorTile
    
-   Hooks: useTelemetry, useAlerts, useBuilding
    

### Wymagające dokończenia:

-   MapCanvas → obecnie placeholder (pusty div)
    
-   CommandCenter → wymaga integracji z finalnym UI z Figma
    
-   Układ wizualny sceny budynku
    

----------

# 📝 Zadania otwarte (Do zrobienia)

### 1. Odtworzenie MapCanvas

-   rendering kondygnacji,
    
-   ikon ratowników,
    
-   ikon beaconów,
    
-   rysowanie hazard zones,
    
-   logika zaznaczania.
    

### 2. Logika przełączania pięter

### 3. UI alertów i panelu bocznego

### 4. Panel SensorTile – dopracowanie danych czujników

### 5. Deployment produkcyjny

-   Nginx + reverse proxy
    
-   certyfikaty SSL
    
-   systemd dla backendu
    
-   build Vite → dist
    

----------

# 📄 Podsumowanie

Projekt ma kompletną logikę komunikacji, backend działa stabilnie, dane z symulatora przepływają poprawnie. Frontend ma gotowy szkielet, store’y, integrację WebSocket, ale wymaga dokończenia warstwy wizualnej.  
Na potrzeby hackathonu można prezentować **backend, integrację, przepływ danych i wstępną makietę UI**.
