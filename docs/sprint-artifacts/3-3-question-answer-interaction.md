# Story 3.3: Question & Answer Interaction

Status: ready-for-dev

## Story

As a Player,
I want to ask a yes/no question and receive an answer,
so that I can eliminate characters.

## Acceptance Criteria

1.  **Given** it is my turn, **when** I type a question into the designated input box and click "Ask", **then** the question text is immediately displayed to my opponent.
2.  **Given** I am the opponent and have been asked a question, **when** I click the "Yes" or "No" button, **then** my answer is immediately displayed to the active player.
3.  **And** every question and answer interaction is recorded as a new entry in the `moves` database table.
4.  **And** after an answer is received, the turn indicator visually prompts the active player to proceed with their next action (character elimination).

## Tasks / Subtasks

-   [ ] **Backend: Database & Real-time** (AC: #1, #2, #3)
    -   [ ] Define RLS policy for the `moves` table to ensure a player can only insert moves for their own `player_id`.
    -   [ ] Create a new Supabase Realtime event named `question-asked` to be broadcast on the `game:[game-id]` channel. The payload should contain the question text and the asking player's ID.
    -   [ ] Create a new Supabase Realtime event named `answer-provided` to be broadcast on the `game:[game-id]` channel. The payload should contain the answer ("yes" or "no").
-   [ ] **Frontend: State Management (Zustand)** (AC: #1, #2)
    -   [ ] Add state variables to the game store to manage the current question (`currentQuestion`), its answer (`currentAnswer`), and UI state (e.g., `isAsking`, `isAnswering`).
    -   [ ] Implement a client-side listener for the `question-asked` event to update the store and display the question to the non-active player.
    -   [ ] Implement a client-side listener for the `answer-provided` event to update the store and display the answer to the active player.
-   [ ] **Frontend: UI Implementation** (AC: #1, #2, #4)
    -   [ ] Create a `QuestionBox` component that is enabled only for the active player. It should contain a text input and an "Ask" button.
    -   [ ] Create an `AnswerBox` component that is displayed to the non-active player when a question is asked. It should contain "Yes" and "No" buttons.
    -   [ ] Integrate these components into the main `game-play` page.
    -   [ ] Ensure the turn indicator visually prompts the active player after an answer is received.
-   [ ] **Frontend: API/DB Interaction** (AC: #3)
    -   [ ] Implement the function that inserts a new row into the `moves` table with `action_type: 'question'` when the "Ask" button is clicked.
    -   [ ] Implement the function that inserts a new row into the `moves` table with `action_type: 'answer'` when "Yes" or "No" is clicked.
-   [ ] **Testing** (AC: #1, #2, #3, #4)
    -   [ ] Write a unit test for the Zustand store to verify that `question-asked` and `answer-provided` events update the state correctly.
    -   [ ] Write an integration test to mock the Realtime events and assert that the `QuestionBox` and `AnswerBox` appear/disappear and are enabled/disabled correctly for each player.
    -   [ ] Write a unit test to verify that the `moves` table insertion functions for 'question' and 'answer' are called correctly.
    -   [ ] Write an integration test to assert that the turn indicator visually prompts the active player after an answer is received.

## Change Log

- 2025-12-02: Initial draft.

## Dev Notes

The core of this story is the real-time, bi-directional communication between players. The database `moves` table serves as the log of events, while Supabase Realtime provides the instant feedback.

-   **Architecture:** The flow is strictly defined:
    1.  Active Player (Client A) -> Insert `moves` row (`action_type: 'question'`).
    2.  Database change -> Triggers Realtime `question-asked` event.
    3.  Opponent (Client B) -> Receives event, UI updates to show question and answer buttons.
    4.  Opponent (Client B) -> Insert `moves` row (`action_type: 'answer'`).
    5.  Database change -> Triggers Realtime `answer-provided` event.
    6.  Active Player (Client A) -> Receives event, UI updates to show the answer.
-   **Source Tree:**
    -   `db/schema.ts`: Verify `moves` table includes `action_type` enum and `details` jsonb.
    -   `app/game-play/store/game-store.ts`: Add new state and actions for Q&A flow.
    -   `app/game-play/components/QuestionBox.tsx` (new component).
    -   `app/game-play/components/AnswerBox.tsx` (new component).
-   **Security:** The RLS policy on the `moves` table is critical to prevent a player from submitting actions on behalf of their opponent.

### Project Structure Notes

-   This story continues to build within the `app/game-play/` feature slice, consistent with the established architecture. The new components (`QuestionBox`, `AnswerBox`) will be created inside `app/game-play/components/`.

### Learnings from Previous Story

-   Previous story (`3-2-turn-management-system`) is marked as `ready-for-dev`. No implementation learnings are available. The key takeaway from its plan is the reliance on the `game_sessions.current_turn_player_id` as the source of truth for who is the active player. This story's UI enabling/disabling will depend on that field.

### References

-   [Source: docs/epics.md#Story-3.3-Question--Answer-Interaction](docs/epics.md#Story-3.3-Question--Answer-Interaction)
-   [Source: docs/architecture.md#Communication-Patterns-(Supabase-Realtime)](docs/architecture.md#Communication-Patterns-(Supabase-Realtime))
-   [Source: docs/architecture.md#Core-Models](docs/architecture.md#Core-Models)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-3-question-answer-interaction.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
