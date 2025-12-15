# Story 3.5: Winning/Losing (The Guess)

Status: review

## Story

As a Player,
I want to make a final guess about the opponent's secret character,
so that I can win the game (or lose if incorrect) and conclude the match.

## Acceptance Criteria

1. **Given** It is my turn
   **When** I click "Make a Guess"
   **Then** I am presented with a confirmation modal ("Are you sure you want to guess [Character Name]?") to prevent accidental loss.

2. **Given** I confirm my guess
   **Then** The system validates the guess against the opponent's secret character on the server (Secure Verification).
   **And** The validation result ("win" or "lose") is returned.

3. **Given** My guess is **CORRECT**
   **Then** The game status updates to `finished`.
   **And** The `winner_id` is set to ME.
   **And** I see a "You Win!" message/screen.
   **And** The opponent sees a "You Lose!" message/screen.

4. **Given** My guess is **INCORRECT**
   **Then** The game status updates to `finished`.
   **And** The `winner_id` is set to the OPPONENT.
   **And** I see a "You Lose!" message/screen.
   **And** The opponent sees a "You Win!" message/screen.

5. **Given** The game has ended
   **Then** No further moves (questions, answers, guesses) can be made.

## Tasks / Subtasks

- [x] **Implement Secure Guess API Endpoint (AC: 2, 3, 4)**
  - [x] Create `POST /api/game/[gameId]/guess` route.
  - [x] Implement server-side validation:
    - Verify it is the requester's turn.
    - Fetch opponent's secret from `player_secrets` table (securely).
    - Compare guessed character ID with secret character ID.
  - [x] Update `game_sessions` table: set `status` to `finished`, `winner_id`, and `ended_at`.
  - [x] Return result `{ result: 'win' | 'lose', correct_character_id: ... }`.
  - [x] Ensure proper error handling (e.g., not your turn, game already finished).

- [x] **Implement `GuessConfirmationModal` Component (AC: 1)**
  - [x] Create `GuessConfirmationModal` in `app/game-play/components/`.
  - [x] Display selected character details and a clear warning ("Incorrect guess results in immediate loss").
  - [x] Add "Confirm Guess" and "Cancel" actions.

- [x] **Integrate Guessing into `InteractionPanel` (AC: 1)**
  - [x] Add "Make a Guess" button to the interaction panel (enabled only during player's turn).
  - [x] Trigger the confirmation modal when clicked.

- [x] **Update `useGameStore` and Game Client (AC: 3, 4, 5)**
  - [x] Add `makeGuess` async action to `useGameStore` to call the API.
  - [x] Handle API response: update local game status and winner state.
  - [x] Subscribe to `game-over` Realtime event (or `UPDATE` on `game_sessions`) to handle the opponent's win/loss notification.
  - [x] Implement a basic "Game Over" state/overlay in `GameClient` (detailed screens in Epic 4, but need basic feedback now).
  - [x] Disable all game interactions when `status === 'finished'`.

- [x] **Testing (AC: 1-5)**
  - [x] Unit Test: `POST /guess` API logic (mocking DB).
  - [x] UI Test: `GuessConfirmationModal` appears and shows correct details.
  - [x] Integration Test: Full flow - User guesses correct -> Win state; User guesses incorrect -> Lose state.

## Dev Notes

### Relevant Architecture Patterns and Constraints
- **Server-Authoritative Verification:** The client **MUST NOT** know the opponent's secret character until the game is over. The guess validation **MUST** happen on the server (`/api/game/...`).
- **Security:** Ensure the API route checks `auth.uid()` to verify the requester is actually the current player.
- **State Management:** `useGameStore` will handle the UI state transition to "Game Over" based on the API response (for the guesser) and Realtime updates (for the opponent).

### Project Structure Notes
- **API Route:** `digital-guess-who/app/api/game/[gameId]/guess/route.ts`
- **Component:** `digital-guess-who/app/game-play/components/guess-confirmation-modal.tsx`

### References
- [Source: docs/sprint-artifacts/tech-spec-epic-3.md#Secure-Guess-Endpoint] - API Contract and Logic.
- [Source: docs/epics.md#Story-3.5] - Functional Requirements.
- [Source: docs/design/secret-character-selection.md#Secure-Guess-Endpoint] - Security Design for Secret Verification.
- [Source: docs/architecture.md] - System Architecture.
- [Source: docs/testing-strategy.md] - Testing Strategy.
- [Source: docs/coding-standards.md] - Coding Standards.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->
- docs/sprint-artifacts/3-5-winning-losing-the-guess.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Added `player_secrets` table definition to `db/types.ts`.
- Implemented `POST /api/game/[gameId]/guess` with strict server-side validation using `supabaseAdmin` client to securely fetch opponent's secret.
- Created `GuessConfirmationModal` for user confirmation before guessing.
- Updated `InteractionPanel` to show "Make a Final Guess" button when it's the player's turn and no question has been asked yet.
- Updated `useGameStore` to include `makeGuess` action and `winnerId` state.
- Updated `GameClient` to handle the guessing flow and display a "Victory/Defeat" overlay when `gameStatus` is 'finished'.
- Added `tests/ui/guess-confirmation-modal.test.tsx` to verify modal rendering and interactions.

### File List

- digital-guess-who/lib/store/game.ts
- digital-guess-who/db/types.ts
- digital-guess-who/app/api/game/[gameId]/guess/route.ts
- digital-guess-who/app/game-play/components/guess-confirmation-modal.tsx
- digital-guess-who/app/game-play/components/interaction-panel.tsx
- digital-guess-who/app/game-play/[code]/game-client.tsx
- digital-guess-who/lib/hooks/use-gameplay-subscription.ts
- digital-guess-who/tests/ui/guess-confirmation-modal.test.tsx

### Learnings from Previous Story

**From Story 3-4-character-elimination-mechanics (Status: done)**

- **New Components:** `CharacterCard` created in `app/game-play/components/` - re-use patterns for `GuessConfirmationModal`.
- **State Management:** `useGameStore` manages `eliminatedCharacterIds` - ensure `gameStatus` and `winnerId` updates don't conflict or are handled in parallel.
- **Turn Management:** Manual turn ending was implemented - ensure "Make a Guess" ends the turn (and the game) implicitly.
- **Pending Items:** `player_secrets` type definition is missing in `database.types.ts` - **SHOULD BE ADDED IN THIS STORY** to avoid `as any` in the API route.
- **Testing:** `GameClient` tests cover turn management - extend to cover "Game Over" state.
- **Refinement:** Consider adding `persist` middleware to `useGameStore` to support page refreshes without losing the elimination board state (from Story 3.4 Review Follow-ups).

[Source: stories/3-4-character-elimination-mechanics.md#Dev-Agent-Record]

## Change Log

- 2025-12-15: Initial draft.
- 2025-12-15: Updated references to include architecture and standards documents.
- 2025-12-15: Added missing learning regarding persist middleware.
