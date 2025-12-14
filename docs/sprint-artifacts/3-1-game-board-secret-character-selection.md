# Story 3.1: Game Board & Secret Character Selection

Status: review

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

### Review Follow-ups (AI)

- [x] [AI-Review][High] Implement server-side logic (likely an API route `/api/game/start` or DB trigger) to monitor `players.is_ready`, transition `game_session.status` to 'playing', and randomize `current_turn_player_id` (AC #3).
- [x] [AI-Review][High] Integrate `useGameplaySubscription` into `GameClient` to actually listen for these updates (AC #3) [file: digital-guess-who/app/game-play/[code]/game-client.tsx].
- [x] [AI-Review][High] Implement the missing tests (UI test for Grid, Integration test for Secret RLS) (AC #1, #2).
- [x] [AI-Review][Med] Implement difficulty logic: fetch `game_session` first to get difficulty, then slice characters accordingly (AC #1) [file: digital-guess-who/app/game-play/[code]/game-client.tsx].

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
- **2025-12-12:** Addressed review findings. Implemented server-side game start logic via trigger `handle_game_start`. Integrated `useGameplaySubscription` in `GameClient` with difficulty-based character slicing. Added missing UI and Integration tests.
- **2025-12-12 (Round 2):** Fixed critical bug where game skipped character selection. Implemented new `phase` column for 2-phase start trigger. Updated Lobby and GameClient to handle new phase flow.

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
- supabase/migrations/20251212100000_game_start_trigger.sql
- digital-guess-who/tests/ui/gameBoard.test.tsx
- digital-guess-who/tests/integration/secretSelection.test.ts
- supabase/migrations/20251212110000_game_status_selecting.sql
- digital-guess-who/app/game-lobby/[code]/page.tsx
- digital-guess-who/lib/store/lobby.ts
- digital-guess-who/lib/hooks/use-game-subscription.ts
- supabase/migrations/20251212130000_add_game_phase.sql

## Change Log
- 2025-12-12: Addressed code review findings - 4 items resolved.
- 2025-12-12: Senior Developer Review notes appended.
- 2025-12-11: Implemented Story 3.1 (Game Board & Secret Selection).

## Learnings from Previous Story

**From Story 2.3-real-time-lobby-player-readiness (Status: done)**

- **New Patterns**: `useLobbyStore` and `useGameSubscription` established patterns for Realtime + Zustand.
- **Files Created**: `lib/store/lobby.ts`, `lib/hooks/use-game-subscription.ts`.
- **Testing**: UI tests for Realtime interactions are established in `tests/ui/gameLobby.test.tsx` - follow this pattern.
- **Security**: RLS is critical. Ensure `players` table policies are correct.
- **Reuse**: Reuse `useGameSubscription` hook logic or extend it for Gameplay events.

[Source: stories/2-3-real-time-lobby-player-readiness.md]

## Senior Developer Review (AI)



### Reviewer

Amelia



### Date

2025-12-14



### Outcome

**APPROVE**



**Justification:**

All acceptance criteria are met. The initial concern regarding state mismatch was resolved by verifying the existence of `20251212130000_add_game_phase.sql`, which correctly handles the `phase` transitions (`lobby` -> `selection` -> `game`) on the server side, aligning with the Client logic. Tests are present and cover the critical paths.



### Summary

The implementation is solid. The use of a dedicated `player_secrets` table ensures security. The game loop transitions are handled via server-side triggers, ensuring integrity even if a client disconnects. Realtime subscriptions are correctly integrated.



### Key Findings



#### Low Severity

- **Documentation:** The migration `20251212130000_add_game_phase.sql` was missing from the Dev Agent Record's file list, though properly implemented.

- **Cleanup:** `gameStatus` enum in `schema.ts` (`waiting`, `active`, `finished`) might be slightly out of sync with the `phase` logic (`lobby`, `selection`, `game`), but since `status` is also updated to `active`, it works.



### Acceptance Criteria Coverage



| AC# | Description | Status | Evidence |

| :--- | :--- | :--- | :--- |

| 1 | Grid of character cards (count based on difficulty) | **IMPLEMENTED** | `game-client.tsx` implements difficulty slicing. |

| 2 | Secret selection saved and protected (RLS) | **IMPLEMENTED** | `player_secrets` table and RLS policies verified. |

| 3 | Game interface activates, first turn assigned, synced via Realtime | **IMPLEMENTED** | `handle_game_start` trigger (v3) updates `phase` to `'game'`, syncing with `GameClient`. |



**Summary:** 3 of 3 acceptance criteria fully implemented.



### Task Completion Validation



| Task | Marked As | Verified As | Evidence |

| :--- | :--- | :--- | :--- |

| Implement Game Board UI | [x] | **VERIFIED** | Component and Tests present. |

| Implement Secret Selection Logic | [x] | **VERIFIED** | Logic and RLS present. |

| Implement Game Start & Turn Assignment | [x] | **VERIFIED** | Server trigger `20251212130000_add_game_phase.sql` handles this. |

| Testing & Verification | [x] | **VERIFIED** | UI (`gameBoard.test.tsx`) and Integration (`secretSelection.test.ts`) tests present. |



**Summary:** 4 of 4 completed tasks verified.



### Test Coverage and Gaps

- **Coverage:** Good coverage of UI rendering and critical RLS integration.

- **Notes:** Ensure E2E tests in Epic 4 cover the full flow.



### Architectural Alignment

- **Aligned:** Follows Architecture for State (Zustand), Sync (Realtime), and Security (RLS).



### Security Notes

- **Verified:** `player_secrets` approach is secure.



### Action Items



**Advisory Notes:**

- Note: Consider unifying `game_status` enum and `phase` text column in future refactoring to avoid confusion.
