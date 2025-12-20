# Story 4.2: Play Again Functionality

**Status:** review
**Epic:** Epic 4 - Post-Game Experience
**Priority:** High

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/4-2-play-again-functionality.context.xml

### Agent Model Used
- Gemini 2.0 Flash Experimental

### Debug Log References
- Fixed regression in `lobbyRealtime.test.ts` due to mismatch in expected listener count.
- Fixed `secretSelection.test.tsx` by renaming to `.tsx` and updating Supabase/Store mocks.

### Completion Notes List
- Implemented `/api/game/[gameId]/play-again` endpoint to create new game session and copy players.
- Updated `GameClient.tsx` to handle "Play Again" button click, broadcast event, and listen for redirect event.
- Added integration test `play-again.test.ts` covering API logic.
- Ensured `GameResultView` uses the loading state correctly.

### File List
- digital-guess-who/app/api/game/[gameId]/play-again/route.ts
- digital-guess-who/tests/integration/play-again.test.ts
- digital-guess-who/app/game-play/[code]/game-client.tsx
- digital-guess-who/tests/integration/lobbyRealtime.test.ts
- digital-guess-who/tests/integration/secretSelection.test.tsx
- docs/sprint-artifacts/sprint-status.yaml

## Story

As a **Player**,
I want to **be able to play another round with the same friend easily**,
so that **we don't have to recreate a lobby from scratch after a match ends**.

## Acceptance Criteria
[Source: docs/sprint-artifacts/tech-spec-epic-4.md#Acceptance-Criteria]

### AC 1: Play Again Initiation
- **Given** I am on the `GameResultView` screen (game is `finished`)
- **When** I click the "Play Again" button
- **Then** the button should show a loading state
- **And** a request should be sent to create a new game session with the same settings (difficulty) and players

### AC 2: Automated Redirect for Initiator
- **Given** I initiated the "Play Again" request
- **When** the new game session is successfully created
- **Then** I should be automatically redirected to the new game lobby (`/game/[new-code]`)

### AC 3: Automated Redirect for Opponent
- **Given** my opponent initiated a "Play Again" request
- **When** the new game session is created
- **Then** I should receive a Realtime notification (Broadcast)
- **And** be automatically redirected to the same new game lobby (`/game/[new-code]`)

### AC 4: Session Continuity
- **Given** a new game session is created via "Play Again"
- **Then** the new session must have the same `difficulty` as the previous one
- **And** both players must be correctly registered as `players` in the new session
- **And** the game state (board, turns, moves) must be completely reset

## Tasks / Subtasks

- [x] Task 1: Implement Play Again API Route (AC 1, AC 4)
  - [x] Create `app/api/game/[gameId]/play-again/route.ts`
  - [x] Implement POST handler to:
    - [x] Validate original game is `finished`
    - [x] Create a new `game_sessions` record (copy difficulty/host_id)
    - [x] Create new `players` records for both participants
    - [x] Return the new `game_code`
  - [x] **Verify:** Unit test ensuring API returns 403 if game not finished
  - [x] **Verify:** Integration test confirming new session links to same players

- [x] Task 2: Update UI and Trigger Broadcast (AC 1, AC 3)
  - [x] Update `GameResultView.tsx` to handle "Play Again" button click
  - [x] In the API or client-side, broadcast a `play-again` event to the current game channel: `{ "newCode": "..." }`
  - [x] **Verify:** Manually verify loading state appears on click
  - [x] **Verify:** Check browser network tab for correct API payload

- [x] Task 3: Implement Realtime Listener for Redirection (AC 3)
  - [x] Update `GameClient.tsx` to listen for the `play-again` broadcast event
  - [x] Use `useRouter` to navigate to the new game code upon receipt
  - [x] **Verify:** Simulate broadcast event and assert router push is called

- [x] Task 4: Integration Testing (AC 2, AC 4)
  - [x] Create `tests/integration/play-again.test.ts`
  - [x] Verify that a new game is created with correct associations and settings
  - [x] Ensure original game history is preserved (not overwritten)
  - [x] **Verify:** Run full E2E flow with two simulated clients

## Dev Notes

### Architecture Patterns and Constraints
- **Realtime Broadcast:** Use `Supabase Realtime` "Broadcast" mode for the `play-again` event (low latency, no persistence needed). [Source: docs/architecture.md#Communication-Patterns]
- **API Security:** The `/play-again` endpoint must use `service_role` carefully to copy player data but must validate the `user_id` of the requester matches the `host_id` of the finished game. [Source: docs/architecture.md#Security-Architecture]
- **State Management:** Reset `useGameStore` completely upon entering the new lobby. [Source: docs/architecture.md#State-Management]

### Project Structure Notes
- **API Route:** Place in `app/api/game/[game-id]/play-again/route.ts` to follow Next.js App Router conventions.
- **Components:** `GameResultView.tsx` is the primary UI touchpoint; keep logic there or in a custom hook `usePlayAgain`. [Source: docs/unified-project-structure.md]

### Learnings from Previous Story
**From Story 4.1: Game Over Screens (Status: done)**

- **New Files Created**:
  - `app/api/game/[gameId]/result/route.ts`: Use as template for the new Play Again API.
  - `GameResultView.tsx`: The primary UI entry point for this story.
  - `use-game-result.ts`: Hook used to fetch post-game data.
- **Architectural Decision**: Secure reveal mechanism established. The Play Again logic should similarly verify session participation.
- **UI Patterns**: Uses `shadcn/ui` Dialog/Overlay. The "Play Again" button already exists as a placeholder.
- **Service Reuse**: Use `AuthService` patterns for user identification.
- **Files to Modify**:
  - `digital-guess-who/app/game-play/components/GameResultView.tsx`: Add button handler and API call.
  - `digital-guess-who/app/game-play/[code]/game-client.tsx`: Add Realtime listener for redirection.

[Source: stories/4-1-game-over-screens.md#Dev-Agent-Record]

### References
- [Tech Spec Epic 4](docs/sprint-artifacts/tech-spec-epic-4.md)
- [Epics Definition](docs/epics.md)
- [Architecture](docs/architecture.md)
- [Unified Project Structure](docs/unified-project-structure.md)
- [Testing Strategy](docs/testing-strategy.md)
- [Coding Standards](docs/coding-standards.md)

## Change Log
- 2025-12-20: Initial draft for Play Again functionality.
- 2025-12-20: Updated with validation fixes (citations, testing subtasks, detailed dev notes).