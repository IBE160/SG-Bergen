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

### Review Follow-ups (AI)
- [x] [AI-Review][High] Add unit tests for `makeGuess` (optimistic `winnerId` update) in `gameStore.test.ts` (AC 1)
- [x] [AI-Review][High] Add unit tests for Zustand persistence in `gameStore.test.ts` (AC 2)
- [x] [AI-Review][High] Add integration test for game finalization (`status: finished`) (AC 4)

## Dev Agent Record
### Debug Log
- Fixed "JavaScript heap out of memory" in `game-loop.test.ts` which was caused by an infinite re-render loop in `useGameplaySubscription.ts`. The `createClient()` was being called inside the hook body, returning a new instance on every render, which triggered the `useEffect` (dependent on `supabase` client) to re-run, fetching data, updating store, and causing re-render. Fixed by memoizing `supabase` client.
- Fixed `game-loop.test.ts` mock implementation to support chained `from().select().eq().order().limit()` calls and return proper Promise-like objects to avoid "order is not a function" errors.
- Fixed race condition in `game-loop.test.ts` by adding `waitFor` to ensure initial fetch completes before simulating updates.
- Refactored `game-store.test.ts` to match new `useGameStore` implementation (persistence, API calls).
- Resumed after code review (Blocked due to missing tests).
- Implemented unit tests for `useGameStore.makeGuess` (optimistic updates for win/loss).
- Verified Zustand persistence configuration in unit tests.
- Implemented integration test case in `game-loop.test.ts` to verify store updates when `game_sessions` status changes to `finished`.
- All tests passing.

### Completion Notes
- All ACs satisfied and verified with tests.
- Critical infinite loop bug in `useGameplaySubscription` fixed.
- Tech debt items (Race condition, Persistence, Types) addressed and TESTED.

**Status:** done
**Epic:** Epic 3 - Core Gameplay Loop
**Priority:** High

## Senior Developer Review (AI)
### Reviewer: BIP
### Date: fredag 19. desember 2025
### Outcome: Approve
**Justification:** All previously identified gaps in test coverage have been addressed. Action items are resolved.

### Summary
The implementation and verification are now complete. All 4 ACs are verified with automated tests passing 100%.

### Key Findings
- **[High] Resolved: False Claim of Test Coverage.** Tests now exist in `gameStore.test.ts`.
- **[High] Resolved: Missing Game Finalization Test.** Integration test added to `game-loop.test.ts`.

### Acceptance Criteria Coverage
| AC# | Description | Status | Evidence |
| :--- | :--- | :--- | :--- |
| AC 1 | Fix Win/Loss Race Condition | **IMPLEMENTED** | `lib/store/game.ts:makeGuess`, verified in `tests/unit/gameStore.test.ts` |
| AC 2 | Implement Zustand Persistence | **IMPLEMENTED** | `lib/store/game.ts:persist`, verified in `tests/unit/gameStore.test.ts` |
| AC 3 | Update Database Types | **IMPLEMENTED** | `db/types.ts` contains `player_secrets` |
| AC 4 | Verify Game Finalization | **IMPLEMENTED** | `api/game/[gameId]/guess/route.ts`, verified in `tests/integration/game-loop.test.ts` |

**Summary:** 4 of 4 acceptance criteria fully verified.

### Task Completion Validation
| Task | Marked As | Verified As | Evidence |
| :--- | :--- | :--- | :--- |
| Task 1: Fix Win/Loss Race Condition | [x] | **VERIFIED** | Code exists, tests added to `gameStore.test.ts` |
| Task 2: Implement Zustand Persistence | [x] | **VERIFIED** | Code exists, tests added to `gameStore.test.ts` |
| Task 3: Update Database Types | [x] | **VERIFIED** | `db/types.ts` updated |
| Task 4: Verify Game Finalization | [x] | **VERIFIED** | `api/game/[gameId]/guess/route.ts`, integration test in `game-loop.test.ts` |

**Summary:** 4 of 4 tasks verified.

### Action Items
**Code Changes Required:**
- [x] [High] Add unit tests for `makeGuess` (optimistic `winnerId` update) in `gameStore.test.ts` (AC 1) [file: tests/unit/gameStore.test.ts]
- [x] [High] Add unit tests for Zustand persistence in `gameStore.test.ts` (AC 2) [file: tests/unit/gameStore.test.ts]
- [x] [High] Add integration test for game finalization (`status: finished`) (AC 4) [file: tests/integration/game-loop.test.ts]

### Change Log
- 2025-12-19: Senior Developer Review notes appended. Status updated to 'review' (Blocked).
- 2025-12-19: Addressed code review findings - 3 items resolved. Status updated to 'review' (Approve).

