# Story 3.2: Turn Management System

Status: ready-for-dev

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

- [ ] **Backend: Update Database Schema** (AC: #3, #4)
    - [ ] Add a `current_turn_player_id` column of type `uuid` to the `game_sessions` table, referencing `players(id)`.
- [ ] **Backend: Real-time Logic** (AC: #3)
    - [ ] Implement logic to update `current_turn_player_id` in the database when a turn-ending action is completed.
    - [ ] Ensure the Supabase Realtime channel (`game:[game-id]`) broadcasts the `turn-changed` event with the new `current_turn_player_id`.
- [ ] **Frontend: State Management** (AC: #1, #2)
    - [ ] Update the Zustand game store to hold `currentTurnPlayerId`.
    - [ ] Implement the client-side listener for the `turn-changed` event to update the Zustand store.
- [ ] **Frontend: UI Implementation** (AC: #1, #2)
    - [ ] Create a "Turn Indicator" UI component that displays "Your Turn" or "Opponent's Turn" based on the state in the Zustand store.
    - [ ] Conditionally disable/enable action buttons ("Ask Question", "Make Guess") based on whether the current user is the active player.
- [ ] **Testing** (AC: #1, #2, #3)
    - [ ] Write unit tests for the Zustand store to verify correct handling of `currentTurnPlayerId` updates.
    - [ ] Write an integration test to mock the Supabase Realtime 'turn-changed' event and assert that the UI correctly enables/disables action buttons and updates the turn indicator.
    - [ ] Write a backend test for the turn-change logic if possible within the current test setup.

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

### Completion Notes List

### File List

## Change Log

- 2025-12-01: Added explicit testing subtasks and initialized Change Log based on validation report.