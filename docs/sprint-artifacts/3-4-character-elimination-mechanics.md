# Story 3.4: Character Elimination Mechanics

Status: ready-for-dev

## Story

As a Player,
I want to flip down characters that don't match the answer,
so that I can narrow down the possibilities.

## Acceptance Criteria

1.  **Given** the active player has received a "Yes" or "No" answer, **when** they click on an active character card on their board, **then** the card visually transitions to an "Eliminated" state.
2.  **And** the "Eliminated" state is visually distinct, graying out the character portrait as specified in the UX Design, but keeping the character visible.
3.  **And** clicking an already "Eliminated" character card toggles it back to the "Active" state, allowing the user to correct mistakes.
4.  **And** this grid state (the set of eliminated characters) is preserved locally for the duration of the game session, even between turns.
5.  **And** eliminated cards are not interactable in a way that would trigger a guess (i.e., you cannot "guess" an eliminated character).

## Tasks / Subtasks

-   [ ] **Frontend: State Management (Zustand)** (AC: #4)
    -   [ ] In `app/game-play/store/game-store.ts`, add a new state variable `eliminatedCharacterIds` (e.g., a `Set<number>`) (AC: #4).
    -   [ ] Create a new action `toggleCharacterElimination(characterId: number)` that adds or removes an ID from the `eliminatedCharacterIds` set (AC: #4).
-   [ ] **Frontend: UI Component (`CharacterCard`)** (AC: #1, #2, #3, #5)
    -   [ ] In `app/game-play/components/CharacterCard.tsx`, subscribe to the `game-store` (AC: #1, #3).
    -   [ ] Determine if the card is eliminated by checking if its ID is in the `eliminatedCharacterIds` set from the store (AC: #1, #2, #3, #5).
    -   [ ] Implement the visual "Eliminated" state (e.g., `filter: grayscale(1)` and `pointer-events: none` for guess actions, but not for the toggle click itself) (AC: #2, #5).
    -   [ ] Add an `onClick` handler to the card that calls the `toggleCharacterElimination` action from the Zustand store (AC: #1, #3).
    -   [ ] Ensure the hover and focus states from the UX spec are implemented for active cards.
-   [ ] **Frontend: UI Integration (`CharacterGrid`)** (AC: #1)
    -   [ ] In `app/game-play/components/CharacterGrid.tsx`, ensure it correctly renders the list of `CharacterCard` components (AC: #1).
    -   [ ] The grid itself does not need new logic; it just needs to render the cards which now have their own stateful logic.
-   [ ] **Testing** (AC: #1, #2, #3, #4, #5)
    -   [ ] **AC #1:** Write an integration test to verify that clicking an active character card transitions it to the "Eliminated" state.
    -   [ ] **AC #2:** Write a visual test (e.g., using Storybook or a similar tool) to confirm that the "Eliminated" state's styling (grayed-out portrait) matches the UX Design Specification.
    -   [ ] **AC #3:** Enhance the integration test from AC #1 to assert that clicking an "Eliminated" card toggles it back to the "Active" state.
    -   [ ] **AC #4:** Write a unit test for the Zustand store (`game-store.ts`) to confirm that the `eliminatedCharacterIds` set is correctly updated by the `toggleCharacterElimination` action.
    -   [ ] **AC #5:** Write a test to ensure that a user cannot initiate a "guess" action by interacting with a character card that is in the "Eliminated" state.

## Change Log

- 2025-12-02: Initial draft created by SM agent.

## Dev Notes

This story is primarily a client-side state and UI task. The state of eliminated characters is intentionally kept local to the client in a Zustand store to ensure a fast, responsive user experience and to reduce unnecessary database writes and real-time traffic. This state does not need to be synchronized with the opponent.

-   **Architecture:**
    -   Client-side state management is handled by **Zustand**, as per the architecture decision. The `eliminatedCharacterIds` set should be part of the game-specific store.
    -   The component being modified is the `CharacterCard.tsx` within the `app/game-play/components/` feature slice.
-   **Source Tree:**
    -   `app/game-play/store/game-store.ts`: The central place for the new state logic.
    -   `app/game-play/components/CharacterCard.tsx`: The primary UI component to be updated.
    -   `app/game-play/components/CharacterGrid.tsx`: The container for the cards.
-   **UX:**
    -   The visual "Eliminated" state should precisely follow the UX specification: the character image is grayed out, not hidden or crossed out. This allows players to review their choices.
    -   The ability to toggle a character back to "Active" is a key usability feature to allow for mistake correction.

### Project Structure Notes

-   All work for this story is contained within the `app/game-play/` feature slice, maintaining the project's established structure. No new files outside of this directory are expected.

### Learnings from Previous Story

-   Previous story (`3-3-question-answer-interaction`) is marked as `ready-for-dev`. No implementation learnings are available. The plan for that story, however, confirms that the Q&A interaction will update the game state to provide the trigger for this story's functionality (i.e., a player receives an answer and can then begin eliminating).

### References

-   [Source: docs/epics.md#Story-3.4-Character-Elimination-Mechanics](docs/epics.md#Story-3.4-Character-Elimination-Mechanics)
-   [Source: docs/ux-design-specification.md#Custom-Component:-Character-Card](docs/ux-design-specification.md#Custom-Component:-Character-Card)
-   [Source: docs/architecture.md#State-Management](docs/architecture.md#State-Management)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-4-character-elimination-mechanics.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
