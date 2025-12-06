# Epic Technical Specification: Game Session Management

Date: lørdag 6. desember 2025
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

This epic focuses on enabling the "Game Session Management" capabilities of the Digital Guess Who application. It bridges the gap between authentication and gameplay by allowing authenticated users to create unique game sessions (hosting) and other users to join these sessions using a secure code (guest). The primary goal is to establish a connected state between two players, handling the real-time synchronization of their presence and readiness status before transitioning them into the core gameplay loop. This builds directly upon the foundational infrastructure (Next.js, Supabase Auth, Database) established in Epic 1.

## Objectives and Scope

**Objectives:**
*   Allow users to initiate a new game session with specific difficulty settings.
*   Enable users to join an existing session via a unique game code.
*   Provide a real-time lobby experience where players can see each other's presence.
*   Implement a "Ready" mechanism to ensure both players are prepared before the game starts.
*   Gracefully handle error states like invalid codes or full lobbies.

**In-Scope:**
*   UI for Game Creation (Difficulty selection).
*   UI for Joining Game (Code input).
*   Lobby Interface (Player avatars/lists, Ready button, Copy code button).
*   Database records creation for `game_sessions` and `players`.
*   Real-time updates for player joining and readiness changes using Supabase Realtime.
*   Client-side routing to/from the lobby.
*   Validation logic for game codes and session capacity.

**Out-of-Scope:**
*   Actual gameplay mechanics (character selection, turns) - handled in Epic 3.
*   Post-game logic (rematch, stats) - handled in Epic 4.
*   Complex matchmaking queues (random opponent).
*   Chat functionality in the lobby.
*   Spectator mode.

## System Architecture Alignment

This implementation leverages the **Feature-Sliced Design** by establishing a dedicated `app/game-lobby` directory.
*   **Database:** Interacts with `game_sessions` and `players` tables.
*   **Real-time:** Utilizes **Supabase Realtime** to broadcast `player-joined` and status updates on the `game:[id]` channel.
*   **State Management:** Uses **Zustand** to manage the local lobby state (players list, ready status) to decouple the UI from the subscription logic.
*   **API:** May use a combination of direct Supabase client calls (for reads/subscriptions) and Next.js Server Actions or API routes (for secure creation/joining) if RLS policies require it, though the architecture suggests direct client interaction where safe.

## Detailed Design

### Services and Modules

| Module/Service | Responsibility | Inputs | Outputs | Owner |
| :--- | :--- | :--- | :--- | :--- |
| `GameService` (Lib) | Wrapper for complex DB interactions (creation, transitions); simple reads/subscriptions use direct client. | Game settings, User ID | `game_session` object, `error` | Client/Server |
| `LobbyStore` (Zustand) | Manages local state for the lobby UI (players, readiness). | Realtime events, User actions | UI State | Client |
| `GameCreationAPI` | Server-side endpoint to create game & host player record atomically. | `difficulty`, `host_id` | `game_code`, `game_id` | API Route |
| `JoinGameAPI` | Server-side endpoint to validate code & add player. | `game_code`, `user_id` | `success`, `game_id`, `error` | API Route |
| `RealtimeManager` | Handles subscription to `game:[id]` channel. | `game_id` | `INSERT`/`UPDATE` events | Client Hook |

### Data Models and Contracts

**Table: `game_sessions`**
*   `id`: UUID (Primary Key)
*   `code`: Text (Unique, user-facing, e.g., "AB12")
*   `status`: Enum ('waiting', 'active', 'finished')
*   `host_id`: UUID (Foreign Key to `users.id`)
*   `difficulty`: Enum ('Easy', 'Medium', 'Hard')
*   `created_at`: Timestamp

**Table: `players`**
*   `id`: UUID (Primary Key)
*   `game_id`: UUID (Foreign Key to `game_sessions.id`)
*   `user_id`: UUID (Foreign Key to `users.id`)
*   `character_id`: Integer (Nullable initially, set in Epic 3)
*   `is_ready`: Boolean (Default: `false`)
*   `joined_at`: Timestamp

### APIs and Interfaces

**1. Create Game**
*   **Endpoint:** `POST /api/game/create`
*   **Request:** `{ "difficulty": "Easy" | "Medium" | "Hard" }`
*   **Response:** `{ "data": { "gameId": "uuid", "code": "ABCD" } }`
*   **Logic:** Generates unique code, inserts `game_session`, inserts host as `player`.

**2. Join Game**
*   **Endpoint:** `POST /api/game/join`
*   **Request:** `{ "code": "ABCD" }`
*   **Response:** `{ "data": { "gameId": "uuid" } }` (or Error: "Game full", "Invalid code")
*   **Logic:** Checks `status='waiting'`, checks player count < 2, inserts guest as `player`.

**3. Toggle Ready**
*   **Method:** Direct Supabase Client Update (using RLS policy allowing player to update own `is_ready`).
*   **Action:** `supabase.from('players').update({ is_ready: true }).eq('user_id', myId)`

### Workflows and Sequencing

**Scenario: Host Creates Game**
1.  User selects "Easy" -> Clicks "Create".
2.  Client calls `POST /api/game/create`.
3.  Server creates session & player records.
4.  Server returns `gameId`.
5.  Client redirects to `/game/[code]`.
6.  Lobby component mounts -> Subscribes to `game:[gameId]`.

**Scenario: Guest Joins**
1.  User enters "ABCD" -> Clicks "Join".
2.  Client calls `POST /api/game/join`.
3.  Server validates & creates player record.
4.  Server returns `gameId`.
5.  Client redirects to `/game/[code]`.
6.  **Realtime:** Host receives `INSERT` event on `players` table -> Updates UI to show Guest.

**Scenario: Both Ready**
1.  Host clicks "Ready" -> `is_ready=true` in DB.
2.  Guest receives `UPDATE` event.
3.  Guest clicks "Ready" -> `is_ready=true` in DB.
4.  Both clients detect `players.every(p => p.is_ready)` -> Trigger navigation/transition to Game Board.
5.  (Optional) Server function or Client trigger updates `game_session.status = 'active'`.

## Non-Functional Requirements

### Performance
*   **Lobby Updates:** Player joining/ready status updates should reflect on opponent's screen within **500ms** (Supabase Realtime).
*   **Page Load:** Lobby page should load interactive elements (Copy Code button) in under **1s**.

### Security
*   **RLS (Row Level Security):**
    *   `game_sessions`: Read-only for public (or restricted to players in session). Insert for Authenticated.
    *   `players`: Read for everyone in the game. Update only for `is_ready` by the user who owns the record.
*   **Code Validation:** Prevent brute-force joining by rate-limiting or code complexity (though 4 chars is standard for casual games, ensuring unique active codes is key).
*   **Authorization:** Only authenticated users can create or join games.

### Reliability/Availability
*   **Connection Loss:** If a player disconnects (closes tab) while in lobby, the system should ideally handle it (e.g., "Player disconnected" status), but for MVP, the session remains.
*   **Race Conditions:** Prevent >2 players joining simultaneously (DB constraint or transaction in `join` API).

### Observability
*   **Logging:** Log failed join attempts (invalid code) to monitor for potential abuse.
*   **Metrics:** Track "Games Created" and "Games Started" (both players ready) to measure funnel conversion.

## Dependencies and Integrations

*   **Supabase Auth:** Required for `user_id`.
*   **Supabase Database:** Primary storage.
*   **Supabase Realtime:** Critical for lobby sync.
*   **shadcn/ui:** Components for Forms (Input, Select), Buttons, Avatars, and Cards (Lobby UI).
*   **lucide-react:** Icons for "Copy", "User", "Check".

## Acceptance Criteria (Authoritative)

1.  **Game Creation:** A logged-in user can create a game with a specific difficulty. They are redirected to a lobby with a unique 4-6 character code.
2.  **Game Joining:** A different logged-in user can enter that code and successfully join the lobby.
3.  **Validation:** Users cannot join a game that does not exist or is already full (2 players).
4.  **Real-time Sync:** When the second player joins, the host's screen updates automatically without a refresh.
5.  **Ready State:** Users can toggle their "Ready" status. The UI reflects the opponent's status in real-time.
6.  **Game Start:** The game does not proceed until **both** players are marked as "Ready".
7.  **Navigation:** Once both are ready, the UI transitions to the gameplay view (or placeholder).

## Traceability Mapping

| AC ID | Requirement Description | Spec Section | Component/API | Test Idea |
| :--- | :--- | :--- | :--- | :--- |
| AC1 | Create Game & Redirect | Workflows: Host Creates | `POST /api/game/create` | Unit test API; E2E test flow |
| AC2 | Join via Code | Workflows: Guest Joins | `POST /api/game/join` | Unit test API with valid code |
| AC3 | Join Validation (Full/Invalid) | APIs: Join Game | `POST /api/game/join` | Attempt join on full game -> Expect 400 |
| AC4 | Real-time Join Update | Detailed Design: Realtime | `LobbyStore` + Realtime | E2E test with 2 browsers |
| AC5 | Ready Toggle Sync | Workflows: Both Ready | `players` RLS update | Check DB update & Realtime event |
| AC6 | Block Start until Ready | Workflows: Both Ready | `LobbyStore` logic | Verify "Start" disabled if 1/2 ready |

## Risks, Assumptions, Open Questions

*   **Risk:** **Race Condition on Join.** Two users trying to join the last spot at the exact same second.
    *   *Mitigation:* Database constraint or transaction in the Join API is safer than client-side check.
*   **Assumption:** Users will be logged in before accessing these features (Middleware protection).
*   **Question:** Do we need a specific "Kick Player" feature for the host?
    *   *Decision:* Out of scope for MVP. Host can just recreate the lobby.
*   **Question:** Should the Game Code be numeric or alphanumeric?
    *   *Decision:* Alphanumeric (uppercase) for readability and entropy (e.g., "K9X2").

## Test Strategy Summary

*   **Unit Tests:**
    *   Test API routes (`create`, `join`) for correct DB insertions and error handling.
    *   Test `LobbyStore` state mutations.
*   **Integration Tests:**
    *   Verify Supabase Realtime subscription connects and receives events.
*   **E2E Tests (Critical):**
    *   Simulate a full flow: User A creates -> User B joins -> A sees B -> A ready -> B ready -> Transition.
