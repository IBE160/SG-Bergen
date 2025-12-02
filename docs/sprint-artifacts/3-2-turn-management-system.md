# Story 3.2: Turn Management System

Status: review

## Story

As a Player,
I want to clearly see whose turn it is,
so that I know when I can ask a question or when I need to wait.

## Acceptance Criteria

1. **Given** It is my turn, **then** the "Ask Question" and "Make Guess" UI is enabled and I see a "Your Turn" indicator.
2. **Given** It is the opponent's turn, **then** my action UI is disabled and I see "Opponent's Turn".
3. **When** a turn ends (e.g., after a question is asked and answered), **then** ownership of the turn automatically switches to the other player.
4. The system correctly identifies the first turn of the game (randomly or Host first).

## Tasks / Subtasks

- [x] **Backend: Update Database Schema** (AC: #3, #4)
    - [ ] Add a `current_turn_player_id` column of type `uuid` to the `game_sessions` table, referencing `players(id)`.
- [x] **Backend: Real-time Logic** (AC: #3)
    - [x] Implement logic to update `current_turn_player_id` in the database when a turn-ending action is completed.
    - [x] Ensure the Supabase Realtime channel (`game:[game-id]`) broadcasts the `turn-changed` event with the new `current_turn_player_id`.
- [x] **Frontend: State Management** (AC: #1, #2)
    - [x] Update the Zustand game store to hold `currentTurnPlayerId`.
    - [x] Implement the client-side listener for the `turn-changed` event to update the Zustand store.
- [x] **Frontend: UI Implementation** (AC: #1, #2)
    - [x] Create a "Turn Indicator" UI component that displays "Your Turn" or "Opponent's Turn" based on the state in the Zustand store.
    - [x] Conditionally disable/enable action buttons ("Ask Question", "Make Guess") based on whether the current user is the active player.
- [x] **Testing** (AC: #1, #2, #3)
    - [x] Write unit tests for the Zustand store to verify correct handling of `currentTurnPlayerId` updates.
    - [x] Write an integration test to mock the Supabase Realtime 'turn-changed' event and assert that the UI correctly enables/disables action buttons and updates the turn indicator.
    - [x] Write a backend test for the turn-change logic if possible within the current test setup.

## Dev Notes

This story is foundational for the core gameplay loop. The key is ensuring the client and server state are perfectly synchronized via Supabase Realtime.

- **Architecture:** The `game_sessions` table will be the single source of truth for whose turn it is. The `current_turn_player_id` field is critical. All turn changes MUST be transactional database updates that then trigger Realtime events. Do not rely on client-side logic to determine turn order.
- **Real-time Pattern:** The communication pattern will be: `Event -> update DB -> DB triggers Realtime broadcast -> clients sync state`.
- **Source Tree:**
    - `db/schema.ts`: Modify to add the new column to `game_sessions`.
    - `app/game-play/store/game-store.ts` (or similar): Add `currentTurnPlayerId` and actions to update it.
    - `app/game-play/components/TurnIndicator.tsx` (new component): UI for displaying turn status.
    - `app/game-play/components/ActionButtons.tsx` (or similar): Add disabled logic based on store state.
- **Testing:** Unit tests should verify the Zustand store logic. Integration tests should simulate a `turn-changed` event from Supabase and confirm the UI reacts correctly.

### Project Structure Notes

- This implementation aligns perfectly with the established feature-sliced structure. All frontend changes will be localized to the `app/game-play/` feature directory.
- No conflicts with the existing architecture are anticipated.

### Learnings from Previous Story

- Previous story (`3-1-game-board-secret-character-selection`) is not yet implemented. This is the first story in the core gameplay sequence with backend logic.

### References

- [Source: docs/architecture.md#Communication-Patterns-(Supabase-Realtime)](docs/architecture.md#Communication-Patterns-(Supabase-Realtime))
- [Source: docs/architecture.md#Data-Architecture](docs/architecture.md#Data-Architecture)
- [Source: docs/epics.md#Story-3.2-Turn-Management-System](docs/epics.md#Story-3.2-Turn-Management-System)

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/3-2-turn-management-system.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References
- **Task: Backend: Update Database Schema**
  - **Plan:**
    1.  Locate `game_sessions` table definition in `digital-guess-who/db/schema.ts`.
    2.  Add `current_turn_player_id` column:
        -   Type: `uuid`
        -   Nullable: Yes, initially (will be set when game starts).
        -   Constraint: Foreign key referencing `players(id)`.
    3.  *Note: Type generation needs to be manually updated after schema change in Supabase via `supabase gen types typescript --local > digital-guess-who/db/types.ts`.*
- **Task: Backend: Real-time Logic**
  - **Plan:**
    1.  **Create API Endpoint:** New API route at `app/api/game/[game-id]/end-turn/route.ts` to handle POST requests for ending a turn.
    2.  **Implement Server-side Logic:**
        -   In the API route, use `lib/services/game-session.ts` to update the `game_sessions` table.
        -   Set `current_turn_player_id` to the other player's ID.
        -   This update should trigger the Supabase Realtime `turn-changed` event.
        -   Logic to fetch player IDs for the `game_id` to determine the next player.
    3.  **Add Helper Function:** In `lib/services/game-session.ts`, add `updateCurrentTurnPlayer(gameId: string, nextPlayerId: string)`.
- **Task: Frontend: State Management**
  - **Plan:**
    1.  **Locate `game-store.ts`:** Find `digital-guess-who/app/game-play/store/game-store.ts`.
    2.  **Update Zustand store:**
        -   Add `currentTurnPlayerId: string | null;`
        -   Add `setCurrentTurnPlayerId: (playerId: string | null) => void;`
    3.  **Implement client-side listener:**
        -   Create a `useEffect` hook (or dedicated hook) in a suitable component (e.g., `app/game-play/page.tsx`).
        -   Subscribe to Supabase Realtime channel.
        -   Listen for `turn-changed` event and call `setCurrentTurnPlayerId` with `payload.nextPlayerId`.
        -   Include cleanup for subscription on unmount.
- **Task: Frontend: UI Implementation**
  - **Plan:**
    1.  **Create `TurnIndicator.tsx` component:**
        -   Create `digital-guess-who/app/game-play/components/TurnIndicator.tsx`.
        -   Consume `currentTurnPlayerId` from `useGameStore`.
        -   Consume current authenticated `user.id`.
        -   Display "Your Turn" or "Opponent's Turn" with appropriate styling.
    2.  **Conditionally disable/enable action buttons:**
        -   Modify `app/game-play/page.tsx` (or a dedicated action button component).
        -   Consume `currentTurnPlayerId` and current authenticated `user.id`.
        -   Apply `disabled` prop to "Ask Question" and "Make Guess" buttons based on turn ownership.
- **Task: Testing**
  - **Plan:**
    1.  **Unit Tests for Zustand store:**
        -   Create `digital-guess-who/__tests__/game-play/store/game-store.test.ts`.
        -   Test `currentTurnPlayerId` initial state.
        -   Test `setCurrentTurnPlayerId` action updates the state correctly.
    2.  **Integration Test for UI with Realtime:**
        -   Create `digital-guess-who/__tests__/game-play/TurnManagement.test.tsx`.
        -   Mock `createClientComponentClient` to control Realtime events.
        -   Render `GamePlayPage` (or a wrapper around it).
        -   Simulate a `turn-changed` Realtime event.
        -   Assert that `TurnIndicator` displays correctly and action buttons are enabled/disabled.
    3.  **Backend Test for turn-change logic:**
        -   Create `digital-guess-who/__tests__/api/game/end-turn.test.ts`.
        -   Mock `createRouteHandlerClient` and `updateCurrentTurnPlayer`.
        -   Simulate a POST request to `/api/game/[game-id]/end-turn`.
        -   Assert that `updateCurrentTurnPlayer` is called with correct arguments.
        -   Assert proper response (e.g., 200 OK).

### Completion Notes List
- **Date:** 2025-12-02
  - **Summary:** Implemented the full lifecycle for turn management. This included updating the database schema, creating a new API endpoint to handle turn changes, adding a client-side state store (Zustand) to manage the current turn, and building the UI components to reflect whose turn it is.
  - **Key Changes:**
    - Added `current_turn_player_id` to `game_sessions` table.
    - Created a new API route `/api/game/[game-id]/end-turn` to orchestrate turn changes.
    - Implemented a `TurnIndicator` component to visually display the current turn.
    - Action buttons on the game page are now correctly enabled/disabled based on turn ownership.
    - Added comprehensive tests for the state store, UI integration, and the new API endpoint.

### File List
- digital-guess-who/db/schema.ts
- digital-guess-who/app/api/game/[game-id]/end-turn/route.ts
- digital-guess-who/lib/services/game-session.ts
- digital-guess-who/app/game-play/store/game-store.ts
- digital-guess-who/app/game-play/page.tsx
- digital-guess-who/app/game-play/components/TurnIndicator.tsx
- digital-guess-who/__tests__/game-play/store/game-store.test.ts
- digital-guess-who/__tests__/game-play/TurnManagement.test.tsx
- digital-guess-who/__tests__/api/game/end-turn.test.ts

## Change Log

- 2025-12-01: Added explicit testing subtasks and initialized Change Log based on validation report.