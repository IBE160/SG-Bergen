# Story 3.1: Game Board & Secret Character Selection

Status: drafted

## Story

As a Player,
I want to see the grid of characters and select my secret identity,
so that the game can begin.

## Acceptance Criteria

1.  **Given** The game has started (both players ready)
    **Then** I see a grid of character cards (count based on difficulty: Easy=12, Medium=24, Hard=48)
2.  **When** I click a character to select it as my secret identity
    **Then** It is visually highlighted/confirmed
    **And** The selection is saved to my `players` record in the database
    **And** The opponent cannot see my selection via network inspection (RLS protected)
3.  **When** Both players have selected their secret characters
    **Then** The main game interface activates (Transition to "Play" mode)
    **And** The first turn is assigned (randomly or Host first) and synced via Realtime

## Tasks / Subtasks

- [ ] **Implement Game Board UI (AC: 1)**
  - [ ] Create `CharacterGrid` component in `app/game-play/components`.
  - [ ] Create `CharacterCard` component in `app/game-play/components` (display image, name).
  - [ ] Implement `useGameStore` (Zustand) to manage `characters` list and `selectedCharacterId`.
  - [ ] Fetch character data (static or DB) based on difficulty level from `game_session`.
- [ ] **Implement Secret Selection Logic (AC: 2)**
  - [ ] Add `selectCharacter` action to `useGameStore`.
  - [ ] Implement `handleCharacterSelection` in `app/game-play/page.tsx` to update `players` table (`character_id`).
  - [ ] Ensure `players` table RLS policies prevent reading `character_id` of other players (or use a separate secure method if strict RLS not yet fully active).
- [ ] **Implement Game Start & Turn Assignment (AC: 3)**
  - [ ] Update `useGameSubscription` to listen for `UPDATE` on `players` (checking if both have `character_id`).
  - [ ] Create API route or secure logic (if Host) to set `current_turn_player_id` in `game_sessions` once both selected.
  - [ ] Update `game_sessions` status to `playing` (or similar active state).
  - [ ] Visual indicator for "Waiting for opponent to select...".
- [ ] **Testing & Verification**
  - [ ] **Unit Test**: `useGameStore` selection logic.
  - [ ] **Integration Test**: Verify `character_id` update is rejected if not own user (RLS check).
  - [ ] **UI Test**: Verify grid renders correct count and selection highlights.

## Dev Notes

- **Architecture:** Use `useGameStore` (Zustand) for client state. `CharacterGrid` should be responsive.
- **Security:** Critical to ensure opponent's secret character is not exposed. For MVP, if strict RLS on `character_id` column is complex, ensure the API/Subscription doesn't broadcast it.
- **Realtime:** Reuse `useGameSubscription` patterns from Story 2.3 for presence and updates.

### Project Structure Notes

- Components: `app/game-play/components/character-grid.tsx`, `app/game-play/components/character-card.tsx`
- Store: `lib/store/game.ts`
- Page: `app/game-play/page.tsx`

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-3.md] - Epic 3 Tech Spec
- [Source: docs/epics.md] - Epic 3 Definitions
- [Source: docs/architecture.md] - Architecture Patterns

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

gemini-2.5-flash

### Debug Log References

### Completion Notes List

### File List

## Learnings from Previous Story

**From Story 2.3-real-time-lobby-player-readiness (Status: done)**

- **New Patterns**: `useLobbyStore` and `useGameSubscription` established patterns for Realtime + Zustand.
- **Files Created**: `lib/store/lobby.ts`, `lib/hooks/use-game-subscription.ts`.
- **Testing**: UI tests for Realtime interactions are established in `tests/ui/gameLobby.test.tsx` - follow this pattern.
- **Security**: RLS is critical. Ensure `players` table policies are correct.
- **Reuse**: Reuse `useGameSubscription` hook logic or extend it for Gameplay events.

[Source: stories/2-3-real-time-lobby-player-readiness.md]
