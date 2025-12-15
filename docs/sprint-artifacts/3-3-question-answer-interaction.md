# Story 3.3: Question & Answer Interaction

Status: review

## Story

As a Player,
I want to ask a yes/no question and receive an answer,
so that I can eliminate characters.

## Acceptance Criteria

1.  **Given** It is my turn **When** I type a question and click "Ask" **Then** The opponent sees the question immediately (Realtime).
2.  **Given** It is the opponent's turn **And** They have asked a question **Then** I see the question and "Yes"/"No" answer buttons.
3.  **When** The opponent clicks "Yes" or "No" **Then** I receive the answer immediately.
4.  **And** The interaction (question and answer) is logged in the `moves` table.
5.  **And** The turn indicator visually prompts the active player to eliminate characters (or end turn).
6.  **And** The Q&A history is visible (at least the last interaction).

## Tasks / Subtasks

- [x] **Implement Q&A UI Components (AC: 1, 2, 6)**
  - [x] Create `QuestionInput` component (text input + "Ask" button) in `InteractionPanel`.
  - [x] Create `AnswerInput` component (display question + "Yes"/"No" buttons) in `InteractionPanel`.
  - [x] Create `MoveHistory` component to display the latest Q&A exchange.
- [x] **Implement Move Submission Logic (AC: 4)**
  - [x] Implement `submitMove` function in `lib/store/game.ts` or `lib/game-logic.ts` to insert into `moves` table.
  - [x] Handle `action_type: 'question'` with `details: { question_text: "..." }`.
  - [x] Handle `action_type: 'answer'` with `details: { answer: "Yes" | "No", related_question_id: "..." }`.
- [x] **Integrate Realtime Move Updates (AC: 1, 3, 5)**
  - [x] Extend `useGameplaySubscription` to listen for `INSERT` on `moves` table.
  - [x] Update `useGameStore` to handle incoming move events:
    - If `question`: Show `AnswerInput` for opponent, `Waiting for Answer` for active player.
    - If `answer`: Show result to active player, prompt for elimination.
- [x] **State Management Updates (AC: 1, 2, 3, 5)**
  - [x] Add `currentInteraction` or `moveHistory` to `useGameStore` to track the active Q&A flow.
  - [x] Handle state transitions: `idle` -> `asking` -> `answering` -> `resolution` (elimination).
- [x] **Testing (AC: 1-6)**
  - [x] Unit test `submitMove` logic.
  - [x] Integration test: Simulate Q&A flow via `RealtimeTestHarness` (ensure RLS allows valid moves).
  - [x] UI Test: Verify "Ask" button is disabled for non-active player (re-verify).
  - [x] UI Test: Verify "Yes/No" buttons appear only for the answerer.

## Dev Notes

### Relevant Architecture Patterns and Constraints

- **Interaction Pattern:** The Q&A flow is asynchronous but near real-time. We use Supabase Realtime to broadcast the `INSERT` on the `moves` table.
- **Data Model:** The `moves` table is the source of truth.
  - `action_type`: `question`, `answer`.
  - `details`: JSONB column for flexibility (e.g., `{ "text": "Is it a woman?" }`).
- **Security:** RLS policies were tightened in Story 3.2 to ensure only the active player can insert 'question' and only the opponent can insert 'answer'. We must handle potential RLS violations gracefully (though UI should prevent them).
- **State Management:** `useGameStore` should hold the transient state of the "current question" so the UI can react immediately.
- **Project Structure:**
  - UI: `app/game-play/components/interaction-panel.tsx` (or sub-components).
  - Logic: `lib/store/game.ts`.

### Project Structure Notes

- **Alignment:** New components should go into `app/game-play/components/`.
- **Naming:** `QuestionInput`, `AnswerInput` or integrated `InteractionPanel`.

### References

- [Source: docs/epics.md#Story-3.3] - User Story and ACs.
- [Source: docs/architecture.md#Communication-Patterns] - Realtime event handling.
- [Source: docs/sprint-artifacts/3-2-turn-management-system.md] - Previous implementation details.

### Learnings from Previous Story

**From Story 3-2-turn-management-system (Status: done)**

- **Secure Moves**: RLS policies are strictly enforced. Ensure `submitMove` sends the correct `player_id` matching `auth.uid()` or the RLS will reject it.
- **Realtime Integration**: Reuse `useGameplaySubscription`. Note that `moves` inserts will trigger events.
- **State Persistence**: `useGameStore` is the client-side source of truth. Ensure it syncs correctly with the incoming Realtime events.
- **Testing**: Previous tests failed due to OOM. Use `jest --runInBand` as configured in the previous story's post-fix.
- **Auth**: `useAuth` was deleted; use Supabase client directly or a new hook if needed, but `useGameStore` seems to manage player identity well.

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-3-question-answer-interaction.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- 2025-12-15: Started work on "Implement Q&A UI Components". Created new UI components, move submission logic, integrated with realtime and updated state management.
- 2025-12-15: All core Q&A interaction components and logic implemented.

### Completion Notes List

- Implemented Q&A UI components: `InteractionPanel`, `QuestionInput`, `AnswerInput`, `MoveHistory`.
- Developed `submitQuestion` and `submitAnswer` functions in `lib/game-logic.ts`.
- Integrated Realtime updates for 'moves' table in `useGameplaySubscription.ts`.
- Updated `useGameStore` with `currentInteraction` and `lastMove` state, and relevant actions.
- Connected UI (`InteractionPanel`) to `useGameStore` and `game-logic` functions in `GameClient.tsx`.
- Added unit tests for move submission logic (`moveSubmission.test.ts`).
- Added UI tests for `InteractionPanel` (`InteractionPanel.test.tsx`).

### File List
- digital-guess-who/app/game-play/components/interaction-panel.tsx (Added)
- digital-guess-who/lib/game-logic.ts (Added)
- digital-guess-who/lib/store/game.ts (Modified)
- digital-guess-who/lib/hooks/use-gameplay-subscription.ts (Modified)
- digital-guess-who/app/game-play/[code]/game-client.tsx (Modified)
- digital-guess-who/tests/unit/moveSubmission.test.ts (Added)
- digital-guess-who/tests/ui/InteractionPanel.test.tsx (Added)

## Change Log

- 2025-12-15: Initial draft.
- 2025-12-15: Added AC references to tasks and Change Log section.
- 2025-12-15: Fixed bug where 'moves' table events were not broadcasting by creating migration `20251215100000_enable_moves_realtime.sql`.