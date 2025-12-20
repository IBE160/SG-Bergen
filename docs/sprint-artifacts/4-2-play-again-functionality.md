# Story 4.2: Play Again Functionality

**Status:** drafted
**Epic:** Epic 4 - Post-Game Experience
**Priority:** High

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/4-2-play-again-functionality.context.xml (to be generated)

## Story

As a **Player**,
I want to **be able to play another round with the same friend easily**,
so that **we don't have to recreate a lobby from scratch after a match ends**.

## Acceptance Criteria

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

- [ ] Task 1: Implement Play Again API Route (AC 1, AC 4)
  - [ ] Create `app/api/game/[gameId]/play-again/route.ts`
  - [ ] Implement POST handler to:
    - [ ] Validate original game is `finished`
    - [ ] Create a new `game_sessions` record (copy difficulty/host_id)
    - [ ] Create new `players` records for both participants
    - [ ] Return the new `game_code`
- [ ] Task 2: Update UI and Trigger Broadcast (AC 1, AC 3)
  - [ ] Update `GameResultView.tsx` to handle "Play Again" button click
  - [ ] In the API or client-side, broadcast a `play-again` event to the current game channel: `{ "newCode": "..." }`
- [ ] Task 3: Implement Realtime Listener for Redirection (AC 3)
  - [ ] Update `GameClient.tsx` to listen for the `play-again` broadcast event
  - [ ] Use `useRouter` to navigate to the new game code upon receipt
- [ ] Task 4: Integration Testing (AC 2, AC 4)
  - [ ] Create `tests/integration/play-again.test.ts`
  - [ ] Verify that a new game is created with correct associations and settings
  - [ ] Ensure original game history is preserved (not overwritten)

## Learnings from Previous Story

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

## Change Log
- 2025-12-20: Initial draft for Play Again functionality.
