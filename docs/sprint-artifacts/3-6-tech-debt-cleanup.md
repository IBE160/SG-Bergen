# User Story: Epic 3 Tech Debt & Stabilization

**Status:** Approved
**Epic:** Epic 3 - Core Gameplay Loop
**Priority:** High

## Description
Address critical technical debt and stability issues identified in the Epic 3 Retrospective to ensure a solid foundation for Epic 4 (Post-Game).

## Acceptance Criteria

### AC 1: Fix Win/Loss Race Condition
- **Given** a player makes a winning guess
- **When** the API returns a success response
- **Then** the client store (`useGameStore`) must optimistically update `winnerId` immediately, without waiting for a realtime subscription event.

### AC 2: Implement Zustand Persistence
- **Given** a player is in an active game
- **When** they refresh the page
- **Then** the game state (board, current turn, logs) should be restored from local storage so the game is not lost.

### AC 3: Update Database Types
- **Given** the codebase uses TypeScript
- **When** accessing `player_secrets` data
- **Then** there should be a proper type definition in `digital-guess-who/db/types.ts`.

### AC 4: Verify Game Finalization
- **Given** a game ends (guess is correct)
- **When** the game logic processes the win
- **Then** the `game_sessions` status in the database must be updated to `finished`.

## Tasks/Subtasks
- [x] Task 1: Fix Win/Loss Race Condition (AC 1)
  - [x] Update `makeGuess` in `useGameStore` to set `winnerId` optimistically
  - [x] Verify UI updates immediately on win
- [x] Task 2: Implement Zustand Persistence (AC 2)
  - [x] Add `persist` middleware to `useGameStore`
  - [x] Configure storage strategy (localStorage)
  - [x] Verify state restoration on refresh
- [x] Task 3: Update Database Types (AC 3)
  - [x] Add `player_secrets` to `digital-guess-who/db/types.ts`
- [x] Task 4: Verify Game Finalization (AC 4)
  - [x] Check `game-logic.ts` or API handler for status update
  - [x] Write/Run test to confirm DB update to `finished`

## Dev Agent Record
### Debug Log
- Fixed "JavaScript heap out of memory" in `game-loop.test.ts` which was caused by an infinite re-render loop in `useGameplaySubscription.ts`. The `createClient()` was being called inside the hook body, returning a new instance on every render, which triggered the `useEffect` (dependent on `supabase` client) to re-run, fetching data, updating store, and causing re-render. Fixed by memoizing `supabase` client.
- Fixed `game-loop.test.ts` mock implementation to support chained `from().select().eq().order().limit()` calls and return proper Promise-like objects to avoid "order is not a function" errors.
- Fixed race condition in `game-loop.test.ts` by adding `waitFor` to ensure initial fetch completes before simulating updates.
- Refactored `game-store.test.ts` to match new `useGameStore` implementation (persistence, API calls).

### Completion Notes
- All ACs satisfied.
- Critical infinite loop bug in `useGameplaySubscription` fixed.
- `game-loop.test.ts` and `game-store.test.ts` passing.
- Tech debt items (Race condition, Persistence, Types) addressed.

**Status:** review
**Epic:** Epic 3 - Core Gameplay Loop
**Priority:** High

