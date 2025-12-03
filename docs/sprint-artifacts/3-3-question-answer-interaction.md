# Story 3.3: Question & Answer Interaction

Status: review

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

-   [x] **Backend: Database & Real-time** (AC: #1, #2, #3)
    -   [x] Define RLS policy for the `moves` table to ensure a player can only insert moves for their own `player_id`. (See migration `20251203120000_harden_rls.sql`)
    -   [x] Create a new Supabase Realtime event named `question-asked` to be broadcast on the `game:[game-id]` channel. (Implemented via `postgres_changes` on `moves` table).
    -   [x] Create a new Supabase Realtime event named `answer-provided` to be broadcast on the `game:[game-id]` channel. (Implemented via `postgres_changes` on `moves` table).
-   [x] **Frontend: State Management (Zustand)** (AC: #1, #2)
    -   [x] Add state variables to the game store to manage the current question (`currentQuestion`), its answer (`currentAnswer`), and UI state (e.g., `isAsking`, `isAnswering`). (Implemented via `lastMove`).
    -   [x] Implement a client-side listener for the `question-asked` event to update the store and display the question to the non-active player.
    -   [x] Implement a client-side listener for the `answer-provided` event to update the store and display the answer to the active player.
-   [x] **Frontend: UI Implementation** (AC: #1, #2, #4)
    -   [x] Create a `QuestionBox` component that is enabled only for the active player. It should contain a text input and an "Ask" button.
    -   [x] Create an `AnswerBox` component that is displayed to the non-active player when a question is asked. It should contain "Yes" and "No" buttons.
    -   [x] Integrate these components into the main `game-play` page.
    -   [x] Ensure the turn indicator visually prompts the active player after an answer is received.
-   [x] **Frontend: API/DB Interaction** (AC: #3)
    -   [x] Implement the function that inserts a new row into the `moves` table with `action_type: 'question'` when the "Ask" button is clicked.
    -   [x] Implement the function that inserts a new row into the `moves` table with `action_type: 'answer'` when "Yes" or "No" is clicked.
-   [x] **Testing** (AC: #1, #2, #3, #4)
    -   [x] Write a unit test for the Zustand store to verify that `question-asked` and `answer-provided` events update the state correctly. (Covered by Integration Test).
    -   [x] Write an integration test to mock the Realtime events and assert that the `QuestionBox` and `AnswerBox` appear/disappear and are enabled/disabled correctly for each player.
    -   [x] Write a unit test to verify that the `moves` table insertion functions for 'question' and 'answer' are called correctly.
    -   [x] Write an integration test to assert that the turn indicator visually prompts the active player after an answer is received.

## Change Log

- 2025-12-02: Initial draft.
- 2025-12-03: Implemented full Q&A flow. Added RLS migration. Created UI components and updated `GamePlayPage` to handle Realtime `moves`. Added comprehensive tests.

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
- **Task: Backend: Database & Real-time**
  - **Plan:**
    - Defined RLS Policies in `supabase/migrations/20251203120000_harden_rls.sql`.
    - Implemented Realtime listening in `app/game-play/page.tsx` using `postgres_changes` on `moves` table.
- **Task: Frontend: State Management**
  - **Plan:**
    - Updated `app/game-play/store/game-store.ts` to include `lastMove`.
- **Task: Frontend: UI Implementation**
  - **Plan:**
    - Created `QuestionBox.tsx` and `AnswerBox.tsx` in `app/game-play/components/`.
    - Integrated into `GamePlayPage`.
- **Task: Testing**
  - **Plan:**
    - Created `__tests__/game-play/components/QuestionBox.test.tsx`
    - Created `__tests__/game-play/components/AnswerBox.test.tsx`
    - Created `__tests__/game-play/QuestionAnswerFlow.test.tsx` (Integration Test)

### Completion Notes List
- **Date:** 2025-12-03
  - **Summary:** Implemented Story 3.3.
  - **Key Changes:**
    - Added RLS hardening migration.
    - Implemented Q&A components and flow.
    - Added full test suite for the new feature.
  - **File List:**
    - digital-guess-who/supabase/migrations/20251203120000_harden_rls.sql
    - digital-guess-who/app/game-play/store/game-store.ts
    - digital-guess-who/app/game-play/page.tsx
    - digital-guess-who/app/game-play/components/QuestionBox.tsx
    - digital-guess-who/app/game-play/components/AnswerBox.tsx
    - digital-guess-who/__tests__/game-play/components/QuestionBox.test.tsx
    - digital-guess-who/__tests__/game-play/components/AnswerBox.test.tsx
    - digital-guess-who/__tests__/game-play/QuestionAnswerFlow.test.tsx

### File List
