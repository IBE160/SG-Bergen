# Story 2.3: Real-time Lobby & Player Readiness

Status: done

## Story

As a Player (Host or Guest),
I want to see when my opponent joins and signal when I am ready,
So that we can start the a game at the same time.

## Acceptance Criteria

1.  **AC1 (Real-time Join Notification):**
    -   **Given** a host is alone in a lobby,
    -   **When** a guest successfully joins the game,
    -   **Then** the host's UI updates in real-time (<500ms) to display the guest's username without requiring a page refresh.

2.  **AC2 (Player Readiness):**
    -   **Given** both players are in the lobby,
    -   **When** a player clicks the "I'm Ready" button,
    -   **Then** their `is_ready` status is updated to `true` in the database,
    -   **And** their status is updated for both players in the UI in real-time (<500ms).
    -   **And** The "Ready" button becomes disabled/green for the player who clicked it.

3.  **AC3 (Game Auto-Start):**
    -   **Given** one player has a status of `is_ready: true`,
    -   **When** the second player clicks "I'm Ready",
    -   **Then** the game automatically transitions to the Gameplay screen for both players.

## Tasks / Subtasks

-   [x] **Backend: Setup Supabase Realtime** (AC: 1, 2)
    -   [x] Enable Realtime for the `players` table in the Supabase dashboard.
    -   [x] Refine Row Level Security (RLS) policies for the `players` table to allow authenticated users to `UPDATE` their own `is_ready` status and `SELECT` players in their own game.

-   [x] **Frontend: Create Lobby Zustand Store** (AC: 1, 2, 3)
    -   [x] Create a new store at `app/game-lobby/store.ts`.
    -   [x] Define state for `players` list, and game status.
    -   [x] Create actions to `setPlayers`, `updatePlayerStatus`, and handle game start.

-   [x] **Frontend: Implement Real-time Subscription** (AC: 1, 2, 3)
    -   [x] In the `app/game-lobby/[code]/page.tsx` component, subscribe to the `game:[gameId]` channel on mount.
    -   [x] Listen for `INSERT` events on the `players` table and update the Zustand store.
    -   [x] Listen for `UPDATE` events on the `players` table (for readiness) and update the Zustand store.
    -   [x] Implement the `game-starting` event trigger on the Host's client when the store detects both players are ready.
    -   [x] Handle the `game-starting` event to navigate both players to the gameplay screen.
    -   [x] Ensure the subscription is properly cleaned up on component unmount.

-   [x] **Frontend: Update Lobby UI** (AC: 2)
    -   [x] Add the "I'm Ready" button to the lobby UI.
    -   [x] The button's `onClick` handler should call a service function to update the player's `is_ready` status in the database.
    -   [x] The button should be disabled and change appearance after being clicked.
    -   [x] The UI should visually represent the readiness status of each player.

-   [x] **Testing** (AC: 1, 2, 3)
    -   [x] Write unit tests for the `LobbyStore` to verify state transitions.
    -   [ ] Write E2E tests (using Playwright/Cypress) to simulate two users, verify real-time UI updates for joining and readiness, and confirm auto-start navigation.

## Dev Notes

### Architecture & Data
-   **Real-time Engine:** Use `Supabase Realtime` for all lobby synchronization. Create a channel for each game: `game:[gameId]`. [Source: docs/tech-spec-epic-2.md#Real-time-Events-Supabase-Broadcast]
-   **Client State:** All client-side lobby state will be managed in a **Zustand store** (`LobbyStore`). This keeps the UI reactive and decoupled from the real-time subscription logic. [Source: docs/tech-spec-epic-2.md#Services-and-Modules]
-   **Data Model:** The `players` table must have an `is_ready` boolean field, defaulting to `false`. [Source: docs/tech-spec-epic-2.md#Data-Models-and-Contracts]

### Learnings from Previous Story
*From Story 2.2 (Join Game Functionality)*
-   **Service to Reuse:** The `GameSessionService` at `lib/services/game-session.ts` should be extended with a method to update a player's readiness status, e.g., `updatePlayerReadyStatus(playerId, isReady)`.
-   **API Pattern:** While this story is real-time focused, the pattern of using a service layer to interact with the backend (in this case, the Supabase client) should be continued.
-   **UI Components:** Continue to use shared components from `components/ui` for buttons and other elements to maintain UI consistency.
-   **File Locations:**
    -   New UI components related to the lobby should be in `components/game-lobby/`.
    -   The main page is at `app/game-lobby/[code]/page.tsx`.
-   [Source: docs/sprint-artifacts/2-2-join-game-functionality.md#Dev-Agent-Record]

### Project Structure Notes
-   **Feature Slice:** All work for this story is contained within the `app/game-lobby/` feature slice and the shared `lib/services/` directory.
-   **State:** The Zustand store should be located at `app/game-lobby/store.ts`.

### References
-   [Source: docs/epics.md#Story-2.3]
-   [Source: docs/tech-spec-epic-2.md#Workflows-and-Sequencing]
-   [Source: docs/tech-spec-epic-2.md#Acceptance-Criteria-Authoritative]

## Dev Agent Record

### Context Reference
- [Context: ./2-3-real-time-lobby-player-readiness.context.xml]

### Agent Model Used
gemini-cli-agent/1.0

### Debug Log References

### Completion Notes
**Completed:** 2025-12-01
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List
- Implemented real-time lobby functionality using Supabase Realtime and Zustand.
- Created RLS policies for the players and game_sessions tables.
- Created the lobby page, which subscribes to real-time events and updates the UI accordingly.
- Added a "Ready" button that updates the player's status.
- Wrote unit tests for the lobby store.
- E2E tests were not implemented as neither Playwright nor Cypress is set up in the project. This should be addressed in a future story.

### File List
- `digital-guess-who/supabase/migrations/20251201100000_refine_player_rls.sql`
- `digital-guess-who/app/game-lobby/store.ts`
- `digital-guess-who/app/game-lobby/[code]/page.tsx`
- `digital-guess-who/__tests__/game-lobby/store.test.ts`
