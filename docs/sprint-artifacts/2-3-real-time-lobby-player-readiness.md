# Story 2.3: Real-time Lobby & Player Readiness

Status: review

## Story

As a Player (Host or Guest),
I want to see when my opponent joins and signal when I am ready,
so that we can start the game at the same time.

## Acceptance Criteria

1.  **Given** I am in the Lobby
    **When** The other player joins
    **Then** The UI updates instantly to show their avatar/name (via Supabase Realtime)
2.  **When** I click "I'm Ready"
    **Then** My status updates to `is_ready: true`
    **And** The "Ready" button becomes disabled/green
3.  **When** Both players are `is_ready: true`
    **Then** The game automatically transitions to the Gameplay screen

## Tasks / Subtasks

- [x] **Implement Client-Side State & Realtime Logic (AC: 1)**
  - [x] Create `useLobbyStore` (Zustand) to manage player list and readiness.
  - [x] Create `useGameSubscription` hook to subscribe to `game:[id]` channel.
  - [x] Handle `INSERT` events on `players` table (new player joined).
  - [x] Handle `DELETE` events or status updates for player leaving/disconnecting.
  - [x] Update UI avatar/list instantly upon events.
- [x] **Implement Player Readiness Interaction (AC: 2)**
  - [x] Add "I'm Ready" button to Lobby UI.
  - [x] Implement `toggleReady` function calling Supabase (update `players` set `is_ready = true`).
  - [x] Disable button and show green state upon success.
- [x] **Implement Game Start Transition (AC: 3)**
  - [x] In `useGameSubscription`, listen for `UPDATE` on `players`.
  - [x] Logic: If `players.length == 2` AND `all(p.is_ready)`, trigger navigation.
  - [x] Redirect both users to `/game-play/[code]`.
- [x] **Testing & Verification**
  - [x] **Unit Test**: Test `useLobbyStore` state transitions.
  - [x] **Integration Test**: Mock Supabase Realtime to verify subscription and event handling (AC 1).
  - [x] **Integration Test**: Verify `toggleReady` API call updates the database correctly (AC 2).
  - [x] **Manual Test**: Open two browsers. Join same game. Verify Player A sees Player B join. Verify Ready status syncs. Verify redirection (AC 3).

## Dev Notes

### Learnings from Previous Story

**From Story 2.2: Join Game Functionality (Status: done)**

- **New Patterns**: `api/game/join` established the API pattern. `JoinGameForm` is the entry point.
- **Files Created/Modified in Previous Story**:
  - `digital-guess-who/app/api/game/join/route.ts`
  - `digital-guess-who/components/home/join-game-form.tsx`
  - `digital-guess-who/app/page.tsx`
  - `digital-guess-who/app/layout.tsx`
  - `digital-guess-who/tests/integration/joinGame.test.ts`
  - `digital-guess-who/tests/ui/home.test.tsx`
  - `digital-guess-who/tests/integration/createGame.test.ts`
  - `digital-guess-who/tests/unit/generateGameCode.test.ts`
  - `digital-guess-who/components/ui/sonner.tsx`
  - `digital-guess-who/components/ui/form.tsx`
- **Pending Review Items**:
  - [ ] [Low] Implement API rate limiting (from Story 2.2). Consider applying this to any new API routes created for readiness toggling if not using direct Supabase client calls.
- **Testing**: UI tests required mocking `global.fetch`. Keep this in mind if testing the Lobby UI.

[Source: docs/sprint-artifacts/2-2-join-game-functionality.md]

### Architecture patterns and constraints

*   **Real-time Integration:** Utilize `Supabase Realtime` with a dedicated channel (e.g., `game:[game-id]`) for low-latency synchronization of player joining and readiness status. Events should transmit critical state updates. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Non-Functional-Requirements]
*   **Client-Side State Management:** Implement a Zustand store to manage the lobby state, subscribing to Supabase Realtime events via custom hooks. Ensure proper subscription lifecycle (connect on mount, disconnect on unmount). [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Detailed-Design]
*   **Database Schema:** The `players` table will need an `is_ready` boolean field. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Data-Models]
*   **Security:** Rely on existing Supabase RLS policies for `players` table to ensure secure updates to `is_ready` status. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Security]
*   **Feature-Sliced Design:** Adhere to the feature-sliced design for lobby components. [Source: docs/architecture.md#Frontend-Architecture]

### Project Structure Notes

*   **Lobby Components:** Place lobby-specific components in `digital-guess-who/app/game-lobby/_components` or `digital-guess-who/components/game-lobby`. [Source: docs/unified-project-structure.md#Component-Structure]
*   **Hooks:** Place custom hooks like `useGameSubscription` in `digital-guess-who/hooks` or `digital-guess-who/lib/hooks`. [Source: docs/unified-project-structure.md#Shared-Libraries]
*   **Store:** Place Zustand stores in `digital-guess-who/lib/store`. [Source: docs/unified-project-structure.md#Shared-Libraries]

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-2.md] - Epic 2 Tech Spec.
- [Source: docs/epics.md] - Epics Definition.
- [Source: docs/architecture.md] - Architecture Documentation.
- [Source: docs/testing-strategy.md] - Testing Strategy.
- [Source: docs/coding-standards.md] - Coding Standards.
- [Source: docs/unified-project-structure.md] - Project Structure.

## Change Log

- tirsdag 9. desember 2025: Initial Draft.
- tirsdag 9. desember 2025: Updated after validation (Fixed citations, structure, and testing coverage).
- tirsdag 9. desember 2025: Updated to resolve minor validation issues (Complete file list, specific citations).
- tirsdag 9. desember 2025: Mark as ready-for-dev with context generated.
- tirsdag 9. desember 2025: Implemented lobby state management, realtime subscription, readiness logic, and navigation. Added unit, integration and UI tests.

## Dev Agent Record

### Context Reference
- `docs/sprint-artifacts/2-3-real-time-lobby-player-readiness.context.xml`

### Agent Model Used
- gemini-2.5-flash

### Debug Log References
- N/A

### Completion Notes List
- Implemented `useLobbyStore` using Zustand for managing player state in the lobby.
- Created `useGameSubscription` hook to listen to Supabase Realtime events (INSERT, UPDATE, DELETE) on the `players` table.
- Updated `GameLobbyPage` to use the store and subscription, providing a reactive UI.
- Added "I'm Ready" button with optimistic updates and database persistence.
- Implemented auto-navigation to `/game-play/[code]` when both players are ready.
- Fixed UI tests by mocking `sonner` and waiting for async effects.

### File List
- digital-guess-who/lib/store/lobby.ts
- digital-guess-who/lib/hooks/use-game-subscription.ts
- digital-guess-who/app/game-lobby/[code]/page.tsx
- digital-guess-who/tests/unit/lobbyStore.test.ts
- digital-guess-who/tests/integration/lobbyRealtime.test.ts
- digital-guess-who/tests/ui/gameLobby.test.tsx
