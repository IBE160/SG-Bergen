# Story 3.5: Winning/Losing (The Guess)

Status: ready-for-dev

## Story

As a Player,
I want to make a final guess to win the game,
so that the match concludes.

## Acceptance Criteria

1. **Given** It is my turn
2. **When** I click "Make a Guess" and select a character
3. **Then** The system checks if it matches the opponent's secret character
4. **If** Correct -> Update game status to `finished`, set `winner_id` to me. I see "You Win!". Opponent sees "You Lose!".
5. **If** Incorrect -> Update game status to `finished`, set `winner_id` to opponent. I see "You Lose!". Opponent sees "You Win!".

## Tasks / Subtasks

- [ ] Task 1 (AC: #1, #2)
  - [ ] Subtask 1.1: Create a "Make a Guess" button in the game UI.
  - [ ] Subtask 1.2: On button click, present a modal with the character grid for selection.
- [ ] Task 2 (AC: #3, #4, #5)
  - [ ] Subtask 2.1: Implement a new API route `/api/game/[id]/guess` that takes a `characterId` in the request body.
  - [ ] Subtask 2.2: The API route must be secure, ensuring the guessing player is part of the game and it is their turn.
  - [ ] Subtask 2.3: The server-side logic will compare the guessed `characterId` with the opponent's stored `character_id`.
  - [ ] Subtask 2.4: Update the `game_sessions` table: set `status` to `finished` and populate the `winner_id` column based on the outcome.
- [ ] Task 3 (AC: #4, #5)
    - [ ] Subtask 3.1: Create a `game-over` event to be broadcast via Supabase Realtime when the game status is updated to `finished`.
    - [ ] Subtask 3.2: The client-side game store (Zustand) should listen for this event.
    - [ ] Subtask 3.3: On receiving the event, the client should transition to the Game Over screen (to be built in Epic 4).

## Dev Notes

- **Architecture:** This story requires a new server-side API route for secure validation of the final guess. This aligns with the architecture's pattern of using Next.js API routes for privileged operations. The win/loss notification will leverage the existing Supabase Realtime infrastructure.
- **Security:** The `character_id` is stored in the `players` table. The guess validation *must* happen on the server to prevent a malicious client from reading the opponent's state and cheating. The `/api/game/[id]/guess` route is critical for this. Row Level Security on the `players` table should prevent a user from reading their opponent's `character_id`.
- **State Management:** The client's Zustand store will need to manage the "guessing" state to show the modal. It will then react to the `game-over` event from the server to transition the UI.
- **Testing:**
  - An integration test for the `/api/game/[id]/guess` endpoint is crucial.
  - E2E tests should cover both winning and losing scenarios.

### Project Structure Notes

- **API Route:** Create `app/api/game/[code]/guess/route.ts`. The `[code]` parameter will be the game code.
- **UI Components:** The "Make a Guess" button will be part of the main game controls in `app/game-play/components/`. The selection modal can be a new component in that same directory.

### References

- [Source: docs/epics.md#Story-3.5-Winning/Losing-(The-Guess)](./docs/epics.md#Story-3.5-Winning/Losing-(The-Guess))
- [Source: docs/architecture.md#Implementation-Patterns](./docs/architecture.md#Implementation-Patterns)
- [Source: docs/tech-spec-epic-2.md#APIs-and-Interfaces](./docs/tech-spec-epic-2.md#APIs-and-Interfaces)

## Change Log

- (initial draft)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-5-winning-losing-the-guess.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
