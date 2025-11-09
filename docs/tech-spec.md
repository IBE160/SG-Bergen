# Tech Spec: Gjett Hvem? (Online Multiplayer)

## 1. Oversikt

Dette dokumentet beskriver den tekniske arkitekturen og planen for å utvikle en online flerspillerversjon av "Gjett Hvem?". Prosjektet vil bestå av en Python-basert backend og en Node.js/React-basert frontend.

## 2. Teknisk Arkitektur

### Backend (Python)

*   **Rammeverk:** [FastAPI](https://fastapi.tiangolo.com/) vil bli brukt for å bygge en rask og moderne API. Det har innebygd støtte for asynkron programmering og WebSockets, som er ideelt for et sanntidsspill.
*   **Database:** [PostgreSQL](https://www.postgresql.org/) vil bli brukt som database, som spesifisert i `proposal.md`. Vi vil bruke [SQLAlchemy](https://www.sqlalchemy.org/) for å interagere med databasen.
*   **Sanntidskommunikasjon:** [WebSockets](https://fastapi.tiangolo.com/advanced/websockets/) vil bli brukt for å synkronisere spillstatus mellom spillere i sanntid.
*   **AI-integrasjon:** [Google Gemini API](https://ai.google.dev/) vil bli brukt for "hint"-funksjonaliteten.

#### API Endpoints

*   `POST /api/game`: Oppretter et nytt spillrom og returnerer en unik `game_code`.
*   `POST /api/game/{game_code}/join`: Lar en spiller bli med i et eksisterende spillrom.
*   `WS /ws/game/{game_code}/{player_id}`: WebSocket-endepunkt for sanntidskommunikasjon under spillet. Meldinger vil bli sendt som JSON-objekter for handlinger som "velg hemmelig karakter", "still spørsmål", "svar på spørsmål", "gjett karakter", etc.

### Frontend (Node.js)

*   **Rammeverk:** [React](https://react.dev/) vil bli brukt for å bygge brukergrensesnittet. Vi bruker [Vite](https://vitejs.dev/) for å sette opp et nytt React-prosjekt, da det gir en raskere utviklingsopplevelse.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) vil bli brukt for styling, som spesifisert i `proposal.md`.
*   **Tilstandshåndtering:** [Zustand](https://zustand-demo.pmnd.rs/) vil bli brukt for å håndtere den globale spillstatusen på en enkel og effektiv måte.
*   **Kommunikasjon:** En WebSocket-klient (sannsynligvis `socket.io-client` eller en enkel wrapper rundt nettleserens innebygde WebSocket API) vil bli brukt for å koble til backend.

## 3. Prosjektstruktur

Prosjektet vil bli organisert i to hovedmapper: `frontend` og `backend`.

```
/
├── frontend/         # Node.js/React-app
│   ├── src/
│   │   ├── components/ # Gjenbrukbare React-komponenter (GameBoard, CharacterCard, etc.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── ...
├── backend/          # Python/FastAPI-app
│   ├── app/
│   │   ├── main.py     # Hovedapplikasjon og API-ruter
│   │   ├── models.py   # SQLAlchemy-modeller
│   │   ├── schemas.py  # Pydantic-schemaer for API-validering
│   │   └── websocket.py# Logikk for WebSocket-tilkoblinger
│   ├── requirements.txt
│   └── ...
└── docs/
    └── tech-spec.md
```

## 4. Utviklingsplan

1.  **Oppsett av Backend:**
    *   Initialiser FastAPI-prosjektet.
    *   Sett opp databaseforbindelse med SQLAlchemy.
    *   Implementer API-endepunktene for å lage og bli med i spill.
    *   Sett opp WebSocket-manager for å håndtere spillrom.

2.  **Oppsett av Frontend:**
    *   Initialiser React-prosjektet med Vite.
    *   Sett opp Tailwind CSS.
    *   Implementer grunnleggende UI-komponenter.
    *   Sett opp WebSocket-tilkobling til backend.

3.  **Implementering av Kjernefunksjonalitet (MVP):**
    *   Implementer logikken for å velge hemmelig karakter.
    *   Implementer spørsmåls- og svarflyten via WebSockets.
    *   Implementer elimineringslogikken på frontend.
    *   Implementer gjettefunksjonen og vinn/tap-betingelser.

4.  **Implementering av "Nice to Have"-funksjoner:**
    *   Integrer Gemini API for hint-funksjonen.
    *   Implementer chat-funksjonalitet.
    *   Implementer muligheten for å laste opp egne karaktersett.

## 5. Suksesskriterier

Suksesskriteriene fra `proposal.md` er fortsatt gyldige og vil bli brukt for å vurdere prosjektets suksess.
