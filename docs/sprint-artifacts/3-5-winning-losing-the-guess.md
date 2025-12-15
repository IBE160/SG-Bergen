# Story 3.5: Winning/Losing (The Guess)

Status: drafted

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

- [ ] **Implement Secure Guess API Endpoint (AC: 2, 3, 4)**
  - [ ] Create `POST /api/game/[gameId]/guess` route.
  - [ ] Implement server-side validation:
    - Verify it is the requester's turn.
    - Fetch opponent's secret from `player_secrets` table (securely).
    - Compare guessed character ID with secret character ID.
  - [ ] Update `game_sessions` table: set `status` to `finished`, `winner_id`, and `ended_at`.
  - [ ] Return result `{ result: 'win' | 'lose', correct_character_id: ... }`.
  - [ ] Ensure proper error handling (e.g., not your turn, game already finished).

- [ ] **Implement `GuessConfirmationModal` Component (AC: 1)**
  - [ ] Create `GuessConfirmationModal` in `app/game-play/components/`.
  - [ ] Display selected character details and a clear warning ("Incorrect guess results in immediate loss").
  - [ ] Add "Confirm Guess" and "Cancel" actions.

- [ ] **Integrate Guessing into `InteractionPanel` (AC: 1)**
  - [ ] Add "Make a Guess" button to the interaction panel (enabled only during player's turn).
  - [ ] Trigger the confirmation modal when clicked.

- [ ] **Update `useGameStore` and Game Client (AC: 3, 4, 5)**
  - [ ] Add `makeGuess` async action to `useGameStore` to call the API.
  - [ ] Handle API response: update local game status and winner state.
  - [ ] Subscribe to `game-over` Realtime event (or `UPDATE` on `game_sessions`) to handle the opponent's win/loss notification.
  - [ ] Implement a basic "Game Over" state/overlay in `GameClient` (detailed screens in Epic 4, but need basic feedback now).
  - [ ] Disable all game interactions when `status === 'finished'`.

- [ ] **Testing (AC: 1-5)**
  - [ ] Unit Test: `POST /guess` API logic (mocking DB).
  - [ ] UI Test: `GuessConfirmationModal` appears and shows correct details.
  - [ ] Integration Test: Full flow - User guesses correct -> Win state; User guesses incorrect -> Lose state.

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
- [Source: docs/design/secret-character-selection.md] - Security Design for Secret Verification.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

### Learnings from Previous Story

**From Story 3-4-character-elimination-mechanics (Status: done)**

- **New Components:** `CharacterCard` created in `app/game-play/components/` - re-use patterns for `GuessConfirmationModal`.
- **State Management:** `useGameStore` manages `eliminatedCharacterIds` - ensure `gameStatus` and `winnerId` updates don't conflict or are handled in parallel.
- **Turn Management:** Manual turn ending was implemented - ensure "Make a Guess" ends the turn (and the game) implicitly.
- **Pending Items:** `player_secrets` type definition is missing in `database.types.ts` - **SHOULD BE ADDED IN THIS STORY** to avoid `as any` in the API route.
- **Testing:** `GameClient` tests cover turn management - extend to cover "Game Over" state.

[Source: stories/3-4-character-elimination-mechanics.md#Dev-Agent-Record]
