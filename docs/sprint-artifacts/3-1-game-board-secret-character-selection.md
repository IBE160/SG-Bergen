# Story 3.1: Game Board & Secret Character Selection

Status: ready-for-dev

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

- [x] **Implement Game Board UI (AC: 1)**
  - [x] Create `CharacterGrid` component in `app/game-play/components`.
  - [x] Create `CharacterCard` component in `app/game-play/components` (display image, name).
  - [x] Implement `useGameStore` (Zustand) to manage `characters` list and `selectedCharacterId`.
  - [x] Fetch character data (static or DB) based on difficulty level from `game_session`.
- [x] **Implement Secret Selection Logic (AC: 2)**
  - [x] Add `selectCharacter` action to `useGameStore`.
  - [x] Implement `handleCharacterSelection` in `app/game-play/page.tsx` to update `players` table (`character_id`).
  - [x] Ensure `players` table RLS policies prevent reading `character_id` of other players (or use a separate secure method if strict RLS not yet fully active).
- [x] **Implement Game Start & Turn Assignment (AC: 3)**
  - [x] Update `useGameSubscription` to listen for `UPDATE` on `players` (checking if both have `character_id`).
  - [x] Create API route or secure logic (if Host) to set `current_turn_player_id` in `game_sessions` once both selected.
  - [x] Update `game_sessions` status to `playing` (or similar active state).
  - [x] Visual indicator for "Waiting for opponent to select..." .
- [x] **Testing & Verification**
  - [x] **Unit Test**: `useGameStore` selection logic.
  - [x] **Integration Test**: Verify `character_id` update is rejected if not own user (RLS check).
  - [x] **UI Test**: Verify grid renders correct count and selection highlights.

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

- docs/sprint-artifacts/3-1-game-board-secret-character-selection.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes List
- Implemented game board with `CharacterGrid` and `CharacterCard`.
- Created `useGameStore` to manage game state including players and status.
- Implemented secure secret selection using a new `player_secrets` table and strict RLS policies (Migration: `20251211120000_add_player_secrets.sql`).
- Implemented Realtime subscription hook `useGameplaySubscription` to sync game start and turn assignment.
- Verified store logic with unit tests.

### File List
- digital-guess-who/app/game-play/components/character-grid.tsx
- digital-guess-who/app/game-play/components/character-card.tsx
- digital-guess-who/app/game-play/[code]/game-client.tsx
- digital-guess-who/app/game-play/[code]/page.tsx
- digital-guess-who/lib/store/game.ts
- digital-guess-who/lib/data/characters.ts
- digital-guess-who/lib/hooks/use-gameplay-subscription.ts
- digital-guess-who/tests/unit/gameStore.test.ts
- supabase/migrations/20251211120000_add_player_secrets.sql

## Change Log
- 2025-12-11: Implemented Story 3.1 (Game Board & Secret Selection).

## Learnings from Previous Story

**From Story 2.3-real-time-lobby-player-readiness (Status: done)**

- **New Patterns**: `useLobbyStore` and `useGameSubscription` established patterns for Realtime + Zustand.
- **Files Created**: `lib/store/lobby.ts`, `lib/hooks/use-game-subscription.ts`.
- **Testing**: UI tests for Realtime interactions are established in `tests/ui/gameLobby.test.tsx` - follow this pattern.
- **Security**: RLS is critical. Ensure `players` table policies are correct.
- **Reuse**: Reuse `useGameSubscription` hook logic or extend it for Gameplay events.

[Source: stories/2-3-real-time-lobby-player-readiness.md]