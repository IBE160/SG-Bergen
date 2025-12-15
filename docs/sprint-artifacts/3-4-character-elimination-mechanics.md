# Story 3.4: Character Elimination Mechanics

Status: done

## Story

As a Player,
I want to visually eliminate characters from my board based on the opponent's answer,
so that I can narrow down the possibilities and effectively strategize my guess.

## Acceptance Criteria

- **Given** I have received an answer **When** I click on a character card **Then** It toggles to "Eliminated" state (grayed out/flipped)
- **And** This state is preserved locally (Zustand store)
- **When** I click "End Turn" (or automatic) **Then** Control passes to the opponent

## Tasks / Subtasks

- [x] **Implement `CharacterCard` Component (AC: 1, 2)**
    - [x] Create `CharacterCard` component in `app/game-play/components/`.
    - [x] Implement visual states for "Active" and "Eliminated" (grayed out/flipped effect).
    - [x] Integrate click handler to toggle state.
    - [x] Ensure `CharacterCard` adheres to accessibility guidelines (keyboard navigation, focus states, screen reader support).
- [x] **Integrate `CharacterCard` into `CharacterBoard` (AC: 1)**
    - [x] Update `CharacterBoard` component to render `CharacterCard` instances.
    - [x] Pass necessary props from `useGameStore` to `CharacterCard` for initial state.
- [x] **Update `useGameStore` for Character Elimination State (AC: 2)**
    - [x] Add state in `useGameStore` to track `eliminatedCharacterIds` (Set or Array).
    - [x] Implement an action in `useGameStore` to toggle elimination status of a character.
    - [x] Ensure local persistence of this state (Zustand).
- [x] **Connect `CharacterCard` to `useGameStore` (AC: 1, 2)**
    - [x] Dispatch the `toggleElimination` action from `CharacterCard`'s click handler.
    - [x] `CharacterCard` should react to `useGameStore` state for its visual representation.
- [x] **Implement "End Turn" Logic (AC: 3)**
    - [x] Ensure "End Turn" button (likely in `GameClient.tsx` or `InteractionPanel.tsx`) correctly triggers turn transition. (Leverage learnings from Story 3.3 for turn management).
    - [x] Verify `game_sessions.current_turn_player_id` updates via Realtime after turn end.
- [x] **Testing (AC: 1-3)**
    - [x] Unit test `useGameStore` actions for toggling elimination status.
    - [x] UI Test: Verify `CharacterCard` visual state changes on click.
    - [x] Integration Test: Verify "End Turn" correctly passes control to opponent.
    - [x] Accessibility Test: Verify keyboard navigation and screen reader announcements for `CharacterCard`.

### Review Follow-ups (AI)
- [ ] [AI-Review][Low] Consider adding `persist` middleware to `useGameStore` to support page refreshes without losing the elimination board state.
- [ ] [AI-Review][Low] Update `database.types.ts` to include `player_secrets` table definition to avoid `as any` casting.

## Dev Notes

### Relevant Architecture Patterns and Constraints
- **State Management:** Use `useGameStore` (Zustand) for client-side management of the `CharacterCard`'s active/eliminated states. This aligns with the architectural decision for Optimistic UI and local state persistence for such transient interactions.
- **Component Structure:** `CharacterCard` will be a UI component within the `app/game-play/components/` feature-sliced directory.
- **Performance:** Character elimination must be instant (0ms latency). This reinforces the use of local state management for the visual feedback.
- **Accessibility:** Ensure `CharacterCard` is fully accessible, including keyboard navigation, visible focus states, and screen reader support, as detailed in the UX Design Specification.

### Project Structure Notes
- **New Components:** `CharacterCard` component should be created under `digital-guess-who/app/game-play/components/`.
- **State Updates:** Modifications to `digital-guess-who/lib/store/game.ts` will be necessary to manage the `eliminatedCharacterIds` state and the `toggleElimination` action.
- **Integration:** `digital-guess-who/app/game-play/[code]/game-client.tsx` and the `CharacterBoard` component will need updates to integrate the new `CharacterCard` functionality.

### Testing & Standards
- **Testing Strategy:** Follow the testing pyramid strategy defined in `docs/testing-strategy.md`. Ensure unit tests for state logic and component interaction tests for the `CharacterCard`.
- **Coding Standards:** Adhere to the naming conventions (PascalCase for components, camelCase for functions) and file structure (feature-sliced) as defined in `docs/coding-standards.md`.

### References

- [Source: docs/epics.md#Story-3.4] - User Story and ACs.
- [Source: docs/sprint-artifacts/tech-spec-epic-3.md#Elimination] - Technical details on elimination.
- [Source: docs/ux-design-specification.md#Custom-Component:-Character-Card] - Detailed UX for Character Card.
- [Source: docs/architecture.md#Decision-Summary] - Justification for Zustand and Optimistic UI.
- [Source: docs/frontend-architecture.md#State-Management-Strategy] - Frontend state management strategy (Zustand).
- [Source: docs/testing-strategy.md] - Testing strategy and pyramid.
- [Source: docs/coding-standards.md] - Coding conventions and standards.
- [Source: docs/sprint-artifacts/3-3-question-answer-interaction.md#Dev-Agent-Record] - Learnings from previous story.

### Learnings from Previous Story

**From Story 3.3: Question & Answer Interaction (Status: done)**

- **UI Components:** The `InteractionPanel`, `QuestionInput`, `AnswerInput`, and `MoveHistory` components were created within `digital-guess-who/app/game-play/components/`. For character elimination, `CharacterCard` components should similarly reside in this feature-sliced directory.
- **Game Logic Functions:** `submitQuestion` and `submitAnswer` in `lib/game-logic.ts` provide a pattern for interacting with game state and Realtime. Similar functions will be needed for handling character elimination.
- **Realtime Integration:** The `useGameplaySubscription` in `lib/hooks/use-gameplay-subscription.ts` handles Realtime updates from the `moves` table. This pattern should be extended or leveraged to manage state changes for character elimination if any server-side sync is required (though the ACs indicate local state).
- **Client-side State Management:** `useGameStore` (`lib/store/game.ts`) was updated to manage `currentInteraction` and `lastMove`. It will also be the central place for managing the local `CharacterCard` states (active/eliminated).
- **Architectural Decisions:** The decision to manage turn ending manually, as reflected in `supabase/migrations/20251215110000_update_turn_end_trigger.sql`, allows for the player to perform elimination actions before explicitly ending their turn. This is directly relevant to this story's flow.
- **Testing Patterns:** Unit and UI tests were established for `moveSubmission.test.ts` and `InteractionPanel.test.tsx`. Similar testing approaches should be used for character elimination logic and UI.

[Source: docs/sprint-artifacts/3-3-question-answer-interaction.md#Dev-Agent-Record]

## Change Log

- 2025-12-15: Initial draft.
- 2025-12-15: Updated Dev Notes to explicitly reference testing strategy and coding standards.
- 2025-12-15: Implemented CharacterCard and updated tests.
- 2025-12-15: Senior Developer Review notes appended.

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-4-character-elimination-mechanics.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Implemented `CharacterCard` component with full accessibility (keyboard, focus, screen reader) and elimination visual state.
- Integrated `CharacterCard` into `CharacterGrid` (CharacterBoard).
- Verified `useGameStore` correctly handles `toggleElimination`.
- Verified `GameClient` "End Turn" functionality and Realtime integration through existing and updated tests.
- Added comprehensive UI tests for `CharacterCard` interaction and accessibility.
- Fixed existing `gamePlay.test.tsx` by updating mocks and fixing query logic to align with current UI state.

### File List

- digital-guess-who/app/game-play/components/character-card.tsx
- digital-guess-who/tests/ui/characterCard.test.tsx
- digital-guess-who/tests/ui/gameBoard.test.tsx
- digital-guess-who/tests/ui/gamePlay.test.tsx

## Senior Developer Review (AI)

### Reviewer
BIP (AI Agent)

### Date
2025-12-15

### Outcome
**Approve**

The implementation successfully delivers the character elimination mechanics and turn management as specified in the Acceptance Criteria. The solution leverages the existing Zustand store and component architecture effectively.

### Summary
The story is complete. `CharacterCard` and `CharacterGrid` components are well-implemented with accessibility considerations. Local state management for elimination works as expected. "End Turn" logic is correctly integrated with the Realtime game loop.

### Key Findings

- **Reliability (Low):** Character elimination state is stored in-memory (Zustand) and will be lost on page refresh. While this meets the "preserved locally" AC for the session, the Epic Tech Spec mentions re-hydration capabilities for reliability. This should be addressed in a future hardening task.
- **Code Quality (Low):** Usage of `as any` for `player_secrets` table insertion in `GameClient` suggests missing type definitions.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| :--- | :--- | :--- | :--- |
| 1 | Click character to toggle "Eliminated" state | **IMPLEMENTED** | `character-card.tsx:47` (visuals), `character-grid.tsx:18` (handler) |
| 2 | State preserved locally (Zustand) | **IMPLEMENTED** | `game.ts:64` (toggleElimination action) |
| 3 | "End Turn" passes control to opponent | **IMPLEMENTED** | `game-client.tsx:142` (handleEndTurn calls `endPlayerTurn`) |

**Summary:** 3 of 3 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| :--- | :--- | :--- | :--- |
| Implement `CharacterCard` Component | [x] | **VERIFIED** | `character-card.tsx` |
| Integrate `CharacterCard` into `CharacterBoard` | [x] | **VERIFIED** | `character-grid.tsx` |
| Update `useGameStore` for Character Elimination | [x] | **VERIFIED** | `game.ts` |
| Connect `CharacterCard` to `useGameStore` | [x] | **VERIFIED** | `character-grid.tsx` |
| Implement "End Turn" Logic | [x] | **VERIFIED** | `game-client.tsx`, `gamePlay.test.tsx` |
| Testing (Unit, UI, Integration) | [x] | **VERIFIED** | `characterCard.test.tsx`, `gamePlay.test.tsx` |

**Summary:** 6 of 6 completed tasks verified.

### Test Coverage and Gaps
- **Coverage:** Excellent unit tests for `CharacterCard` visual states and accessibility. `GameClient` tests cover turn management UI states (enabled/disabled buttons).
- **Gaps:** No explicit test for persistence of elimination state across unmount/remount (though `gameBoard.test.tsx` covers interaction).

### Architectural Alignment
- **State Management:** Correctly uses `useGameStore` (Zustand) for client-side transient state.
- **Component Structure:** Follows feature-sliced design (`app/game-play/components`).
- **Realtime:** Uses established patterns for turn management.

### Security Notes
- `CharacterGrid` respects `readonly` prop, preventing interaction when it's not the user's turn (enforced by `GameClient` passing `selectionMode` or `readonly` context implied).

### Best-Practices and References
- [Zustand Best Practices](https://github.com/pmndrs/zustand) - Consider `persist` middleware for resilience.

### Action Items

**Advisory Notes:**
- Note: Consider adding `persist` middleware to `useGameStore` to support page refreshes without losing the elimination board state.
- Note: Update `database.types.ts` to include `player_secrets` table definition to avoid `as any` casting.