# Epic Technical Specification: Game Session Management

Date: November 30, 2025
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

This technical specification outlines the design and implementation details for Epic 2: Game Session Management. This epic is a cornerstone of the "Digital Guess Who" project, enabling the core social experience of creating, joining, and preparing for a game. It covers the user journey from the initial lobby screen to the moment the game officially begins, focusing on real-time player synchronization and a frictionless setup process. The successful implementation of this epic will allow two players to reliably connect and enter a shared game session, ready for gameplay.

This document translates the functional requirements from the PRD and the high-level strategies from the Architecture document into a concrete technical plan. It details the specific data models, API interactions, real-time events, and client-side state management required to build a robust and performant lobby system.

## Objectives and Scope

**In-Scope:**
-   **Game Creation:** A logged-in user can configure and create a new game session, which generates a unique, shareable game code.
-   **Difficulty Selection:** The creator of the game can select the game's difficulty (Easy, Medium, Hard), which dictates the number of characters in the subsequent gameplay epic.
-   **Game Joining:** A second player can use a valid game code to join an existing, waiting game session.
-   **Real-time Lobby:** The lobby UI must update in real-time as players join and update their readiness status. This will be implemented using Supabase Realtime.
-   **Player Readiness:** Both players must be able to signal they are "Ready," and the game will not start until both have done so.
-   **Transition to Gameplay:** Once both players are ready, the system will automatically transition both users to the core gameplay screen.

**Out-of-Scope:**
-   **Core Gameplay Mechanics:** All turn-based actions, character selection, questioning, and guessing are handled in Epic 3.
-   **User Authentication:** While players must be authenticated, the sign-up and login flows are part of Epic 1 (Project Foundation).
-   **In-Game Chat:** Any chat functionality is a post-MVP feature and not included.
-   **Handling more than two players:** The system is strictly designed for two-player sessions.
-   **AI Bots or Single-Player Mode:** This epic only concerns human-vs-human session setup.

## System Architecture Alignment

The implementation of this epic aligns directly with the foundational decisions made in the **Architecture Document**.

-   **Real-time Engine:** We will heavily utilize **Supabase Realtime** for instant synchronization of the lobby state. A dedicated channel for each game session (e.g., `game:[game_id]`) will broadcast `player-joined` and `player-ready` events, ensuring both clients have a consistent view of the lobby without needing to poll the server.
-   **State Management:** Client-side state (e.g., the current game code, list of players in the lobby, readiness status) will be managed by a dedicated **Zustand** store. This decouples the UI from the data-fetching logic, simplifies state updates in response to Realtime events, and makes the lobby components more testable.
-   **Data Persistence:** Game session details (`game_sessions` table) and player information (`players` table) will be stored in the **Supabase (PostgreSQL)** database. The schema defined in the architecture will be used to create and update these records.
-   **API Routes:** While most of the real-time logic will be handled directly via the Supabase client library, initial game creation and joining may be handled by dedicated **Next.js API Routes** (e.g., `/api/game/create`, `/api/game/join`) to perform server-side validation and protect against unauthorized actions before a user is subscribed to a Realtime channel.

The primary components involved will reside within the `app/game-lobby/` feature slice as outlined in the architecture's project structure.

## Detailed Design

### Services and Modules

| Service / Module | Location | Responsibilities | Inputs / Outputs | Owner |
| :--- | :--- | :--- | :--- | :--- |
| **GameSessionService** | `lib/services/game-session.ts` | Handles business logic for creating, joining, and managing game sessions. Interacts directly with the Supabase client. | **Input:** User ID, Difficulty. **Output:** New game session object or error. | Backend |
| **LobbyStore** | `app/game-lobby/store.ts` | Zustand store managing all client-side state for the lobby, including game code, player list, and readiness status. | **Input:** Realtime events. **Output:** Reactive state for UI components. | Frontend |
| **LobbyPage** | `app/game-lobby/page.tsx` | Main React component for the lobby UI. Renders the game setup, waiting screen, and player list. Subscribes to the LobbyStore. | **Input:** User session. **Output:** Rendered HTML. | Frontend |
| **SupabaseRealtimeClient** | `lib/supabase/client.ts` | Configured Supabase client responsible for subscribing to game channels and receiving real-time events. | **Input:** Channel name, event callbacks. **Output:** Live data updates. | Backend |

### Data Models and Contracts

The following data models will be implemented in the Supabase database, defined in `db/schema.ts`.

**`game_sessions` Table:**
```typescript
// db/schema.ts
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const gameSessions = pgTable('game_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 6 }).unique().notNull(), // e.g., 'A4B-C1D'
  status: text('status', { enum: ['waiting', 'active', 'finished'] }).default('waiting').notNull(),
  hostId: uuid('host_id').references(() => users.id).notNull(),
  difficulty: text('difficulty', { enum: ['Easy', 'Medium', 'Hard'] }).default('Medium').notNull(),
  winnerId: uuid('winner_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

**`players` Table:**
```typescript
// db/schema.ts
import { pgTable, uuid, boolean } from 'drizzle-orm/pg-core';
import { gameSessions } from './game-sessions';
import { users } from './users'; // Assuming a users table from Supabase Auth

export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id').references(() => gameSessions.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  isReady: boolean('is_ready').default(false).notNull(),
  // secret_character_id will be added in Epic 3
});
```

### APIs and Interfaces

#### API Endpoints

1.  **`POST /api/game/create`**
    *   **Description:** Creates a new game session.
    *   **Request Body:** `{ "difficulty": "Easy" | "Medium" | "Hard" }`
    *   **Response (Success):** `{ "data": { "code": "ABC-DEF" } }`
    *   **Response (Error):** `{ "error": { "message": "..." } }`
    *   **Security:** Requires an authenticated user session.

2.  **`POST /api/game/join`**
    *   **Description:** Allows a player to join an existing game session.
    *   **Request Body:** `{ "code": "ABC-DEF" }`
    *   **Response (Success):** `{ "data": { "gameId": "..." } }`
    *   **Response (Error):** `{ "error": { "message": "Invalid game code." | "Game is full." } }`
    *   **Security:** Requires an authenticated user session.

#### Real-time Events (Supabase Broadcast)

*   **Channel:** `game-[gameId]`
*   **Events:**
    *   **`player-joined`**:
        *   **Payload:** `{ "userId": "...", "username": "..." }`
        *   **Action:** Sent when a new player successfully joins the game. The lobby store adds the new player to its state.
    *   **`player-ready`**:
        *   **Payload:** `{ "userId": "...", "isReady": true }`
        *   **Action:** Sent when a player updates their readiness status. The lobby store updates the corresponding player's state.
    *   **`game-starting`**:
        *   **Payload:** `{}`
        *   **Action:** Sent by the host's client (or a serverless function) once both players are ready. Triggers the client-side navigation to the gameplay screen.

### Workflows and Sequencing

**1. Create Game Flow:**
1.  **Host User** clicks "Start a New Game" on the home page.
2.  **Frontend** navigates to the Game Setup screen (`/game-lobby`).
3.  Host selects **Difficulty** and clicks "Create".
4.  **Frontend** sends a `POST` request to `/api/game/create` with the selected difficulty.
5.  **Backend (`/api/game/create`)**:
    a. Generates a unique 6-character `code`.
    b. Creates a new row in the `game_sessions` table with `status: 'waiting'`.
    c. Creates a `players` record for the host, linking them to the new session.
    d. Returns the `code` to the frontend.
6.  **Frontend** receives the code and navigates to the lobby URL (e.g., `/game/[code]`).
7.  **LobbyPage component** mounts, subscribes to the Supabase Realtime channel `game-[gameId]`, and displays "Waiting for opponent...".

**2. Join Game Flow:**
1.  **Guest User** receives a game code from the Host.
2.  On the home page, Guest enters the `code` and clicks "Join".
3.  **Frontend** sends a `POST` request to `/api/game/join` with the code.
4.  **Backend (`/api/game/join`)**:
    a. Validates the code exists and the `game_session` status is `waiting`.
    b. Checks that the number of players in the session is less than 2.
    c. If valid, creates a new `players` record for the Guest.
    d. Triggers a `player-joined` event on the Realtime channel (or the frontend does after success).
    e. Returns the `gameId` to the Guest's frontend.
5.  **Guest Frontend** navigates to `/game/[code]`.
6.  **Host Frontend** (already in the lobby) receives the `player-joined` Realtime event and the **LobbyStore** updates, causing the UI to re-render and show the Guest's name.

**3. Game Start Flow:**
1.  Both players are in the lobby (`/game/[code]`).
2.  A player clicks "I'm Ready".
3.  **Frontend** updates the `players` table for that user, setting `is_ready = true`.
4.  This database change triggers a `player-ready` event on the Supabase Realtime channel.
5.  Both clients receive the event and update their **LobbyStore**. The UI updates to show the player's ready state.
6.  When the **LobbyStore** on the **Host's client** detects that both players are ready, it triggers a `game-starting` event.
7.  Both clients receive the `game-starting` event and navigate to the core gameplay screen (`/game-play/[code]`).

## Non-Functional Requirements

### Performance

-   **Lobby Update Latency:** Real-time events (player joining, readiness changes) must be reflected in the UI of all clients within **500ms**, as specified in the PRD. This will be achieved via Supabase Realtime.
-   **API Response Time:** The `POST /api/game/create` and `POST /api/game/join` API endpoints must have a response time of less than **750ms** under normal load.
-   **Page Load Time:** The initial load time for the lobby page (`/game/[code]`) should be under **2 seconds**. Vercel's infrastructure and Next.js server-side rendering will be key to achieving this.

### Security

-   **Authentication:** All API endpoints (`/api/game/create`, `/api/game/join`) and database interactions for creating or modifying session data **must** be protected and require a valid, authenticated user session from Supabase Auth.
-   **Authorization (RLS):** Row Level Security policies must be configured on the `game_sessions` and `players` tables to enforce the following rules:
    -   Users can only `INSERT` a `players` record for themselves.
    -   Users can only `UPDATE` their own `players` record (e.g., to set `is_ready`).
    -   Users can only `SELECT` data for game sessions they are a part of.
-   **Input Validation:** The `code` parameter in the `/api/game/join` endpoint must be strictly validated to prevent injection attacks and ensure it conforms to the expected format. The difficulty setting must also be validated against the allowed enum values.

### Reliability/Availability

-   **Disconnection Handling:** The client application must gracefully handle temporary WebSocket disconnections from the Supabase Realtime service. It should attempt to automatically reconnect for up to 30 seconds.
-   **Error States:** The UI must clearly communicate failures (e.g., "Invalid game code," "Game is full," "Host has left") and provide the user with a clear path forward (e.g., "Return to Menu"), as defined in the UX Specification.
-   **Race Conditions:** The logic for joining a game must be atomic to prevent a race condition where two players could potentially join a game that only has one spot left. This can be handled via database constraints or by wrapping the join logic in a Postgres transaction within a serverless function.

### Observability

-   **API Logging:** All API route handlers (`/api/game/*`) will include structured logging (using a library like `pino`) to record the start and end of a request, its outcome (success/failure), and the associated `gameId` and `userId`.
-   **Error Tracking:** Unhandled exceptions in both the frontend components (using an Error Boundary) and backend API routes will be captured and sent to an error tracking service (e.g., Vercel logging or a third-party like Sentry).
-   **Critical Event Monitoring:** Key events in the session lifecycle will be logged with a `[INFO]` level:
    -   `Game created: { gameId, userId, difficulty }`
    -   `Player joined: { gameId, userId }`
    -   `Game started: { gameId }`

## Dependencies and Integrations

**Internal Dependencies:**
-   **Epic 1 (Project Foundation):** This epic depends entirely on the successful completion of Epic 1, which establishes the Next.js project, Supabase connection, authentication setup, and base UI components.
-   **`@/lib/supabase/client`:** The configured Supabase client is essential for all database and real-time interactions.
-   **`@/components/ui/`:** Foundational UI components from `shadcn/ui` like `Button` and `Input` will be used to build the lobby interface.

**External Dependencies (from `package.json`):**
-   **`@supabase/supabase-js`:** The primary client library for interacting with the Supabase backend (database and real-time).
-   **`@supabase/ssr`:** Used for server-side authentication and session management with Next.js.
-   **`next`:** The core React framework.
-   **`react` / `react-dom`:** The UI library.
-   **`zustand`:** (To be added) The client-side state management library for the lobby store.
-   **`clsx` / `tailwind-merge`:** Utility libraries for constructing dynamic and conflict-free CSS classes with Tailwind CSS.
-   **`lucide-react`:** Used for icons within UI components (e.g., a "copy" icon for the game code).

**Integration Points:**
-   **Supabase Backend:** This is the most critical integration point. This epic will integrate with:
    -   **Supabase Auth:** To get the current user's ID.
    -   **Supabase PostgreSQL:** To persist `game_sessions` and `players` records.
    -   **Supabase Realtime:** To subscribe to lobby events and achieve live updates.
-   **Vercel:** The application will be deployed on Vercel. Environment variables for Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) must be configured in the Vercel project settings.

## Acceptance Criteria (Authoritative)

This section provides the definitive, testable acceptance criteria for this epic, derived from the PRD and user stories.

1.  **AC1 (Game Creation):**
    -   **Given** an authenticated user is on the game setup screen,
    -   **When** they select a difficulty ("Easy", "Medium", or "Hard") and click the "Create" button,
    -   **Then** a new `game_sessions` record is created in the database with the correct `host_id` and `difficulty`,
    -   **And** a unique, 6-character game `code` is generated and stored,
    -   **And** the user is automatically redirected to the lobby URL (`/game/[code]`).

2.  **AC2 (Game Joining):**
    -   **Given** a valid game `code` for a session with `status: 'waiting'` and only one player,
    -   **When** a second authenticated user enters the code and clicks "Join",
    -   **Then** a new `players` record is created linking the second user to the game session,
    -   **And** the user is redirected to the lobby URL (`/game/[code]`).

3.  **AC3 (Invalid Join):**
    -   **Given** a user attempts to join with an invalid or expired code,
    -   **When** they submit the join request,
    -   **Then** the UI displays a clear error message (e.g., "Invalid game code") and the user remains on the home/join page.

4.  **AC4 (Full Game):**
    -   **Given** a user attempts to join a game that already has two players,
    -   **When** they submit the join request,
    -   **Then** the UI displays a clear error message (e.g., "This game is already full").

5.  **AC5 (Real-time Join Notification):**
    -   **Given** a host is alone in a lobby,
    -   **When** a guest successfully joins the game,
    -   **Then** the host's UI updates in real-time (<500ms) to display the guest's username without requiring a page refresh.

6.  **AC6 (Player Readiness):**
    -   **Given** both players are in the lobby,
    -   **When** a player clicks the "I'm Ready" button,
    -   **Then** their `is_ready` status is updated to `true` in the database,
    -   **And** their status is updated for both players in the UI in real-time (<500ms).

7.  **AC7 (Game Auto-Start):**
    -   **Given** one player has a status of `is_ready: true`,
    -   **When** the second player clicks "I'm Ready",
    -   **Then** the game status automatically updates,
    -   **And** both players are immediately redirected to the main gameplay screen (`/game-play/[code]`).

## Traceability Mapping

This table maps each acceptance criterion back to the originating user story and the technical components responsible for its implementation.

| Acceptance Criterion | User Story | Technical Components | Test Idea (Unit / Integration / E2E) |
| :--- | :--- | :--- | :--- |
| **AC1 (Game Creation)** | Story 2.1 | `LobbyPage`, `GameSessionService`, `POST /api/game/create`, `game_sessions` table | **E2E:** Simulate user clicking create and verify redirection and database entry. |
| **AC2 (Game Joining)** | Story 2.2 | `HomePage`, `GameSessionService`, `POST /api/game/join`, `players` table | **E2E:** Simulate a second user joining with a valid code and verify redirection. |
| **AC3 (Invalid Join)** | Story 2.2 | `HomePage`, `POST /api/game/join` | **Integration:** Test the `/api/game/join` endpoint with a non-existent code. |
| **AC4 (Full Game)** | Story 2.2 | `HomePage`, `POST /api/game/join` | **Integration:** Test the `/api/game/join` endpoint for a game that already has 2 players. |
| **AC5 (Real-time Join)** | Story 2.3 | `LobbyPage`, `LobbyStore`, Supabase Realtime Channel | **E2E:** Have two test clients; one joins and verify the other's UI updates automatically. |
| **AC6 (Player Readiness)**| Story 2.3 | `LobbyPage`, `LobbyStore`, `players` table, Supabase Realtime | **E2E:** Have a player click "Ready" and verify the status updates for both clients. |
| **AC7 (Game Auto-Start)**| Story 2.3 | `LobbyStore`, `game-starting` event | **E2E:** Have the second player click "Ready" and verify both clients are navigated to the gameplay screen. |

## Risks, Assumptions, Open Questions

-   **Risk:** **Real-time Event Storms.** If not handled correctly, a client rapidly connecting/disconnecting could trigger an event storm, degrading performance.
    -   **Mitigation:** Implement rate limiting on the client-side for actions that trigger Realtime events. The `LobbyStore` will also debounce incoming events to prevent excessive re-renders.
-   **Risk:** **Game Code Collisions.** Although a 6-character alphanumeric code has a large number of possibilities, collisions are theoretically possible.
    -   **Mitigation:** The `/api/game/create` service will have a retry mechanism. If the generated code already exists in the database, it will generate a new one before failing. The `code` column in the `game_sessions` table has a `UNIQUE` constraint to prevent this at the database level.
-   **Assumption:** **Stable Internet Connection.** The design assumes users will have a reasonably stable internet connection. While we have basic disconnect handling, a very poor connection will lead to a degraded experience.
-   **Assumption:** **Client-side clocks are reasonably accurate.** The system does not currently rely on client-side time for any critical logic, but this is an assumption to be aware of for future features.
-   **Open Question:** **Orphaned Games.** What is the cleanup strategy for `game_sessions` that are created but never started (i.e., status remains `waiting` for an extended period)?
    -   **Next Step:** For the MVP, no automatic cleanup will be implemented. A post-MVP task will be to create a scheduled Supabase Edge Function to delete games older than 24 hours.

## Test Strategy Summary

The testing strategy for this epic will cover all levels of the testing pyramid to ensure functionality, reliability, and a positive user experience.

-   **Unit Tests (Jest / React Testing Library):**
    -   Test the `LobbyStore` (Zustand) logic in isolation to ensure state transitions are correct in response to dispatched actions (e.g., adding a player, updating readiness).
    -   Write unit tests for any utility functions, such as the game code generator.
    -   Test individual React components (`LobbyPage`, etc.) with mocked data to verify they render correctly in different states (e.g., waiting, full lobby, ready states).

-   **Integration Tests (Jest / React Testing Library):**
    -   Test the API route handlers (`/api/game/create`, `/api/game/join`) by mocking the Supabase client (`supabase-js`) to verify input validation, error handling, and correct database interactions.
    -   Test the integration between the `LobbyPage` component and the `LobbyStore`, ensuring that UI actions correctly trigger store updates.

-   **End-to-End (E2E) Tests (Playwright / Cypress - TBD):**
    -   **Test Case 1 (Happy Path):** A full E2E test simulating two users. User A creates a game, User B joins it, both mark themselves as ready, and verify that both are redirected to the gameplay screen. This is the most critical test for the epic.
    -   **Test Case 2 (Invalid Code):** Simulate a user trying to join with a non-existent game code and assert that the correct error message is shown.
    -   **Test Case 3 (Real-time UI Update):** Use two concurrent browser sessions in the test runner to verify that when User B joins, User A's screen updates automatically without a manual refresh.
