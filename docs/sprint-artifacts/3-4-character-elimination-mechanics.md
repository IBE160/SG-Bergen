# Story 3.4: Character Elimination Mechanics

Status: ready-for-dev

## Story

As a Player,
I want to visually eliminate characters from my board based on the opponent's answer,
so that I can narrow down the possibilities and effectively strategize my guess.

## Acceptance Criteria

- **Given** I have received an answer **When** I click on a character card **Then** It toggles to "Eliminated" state (grayed out/flipped)
- **And** This state is preserved locally (Zustand store)
- **When** I click "End Turn" (or automatic) **Then** Control passes to the opponent

## Tasks / Subtasks

- [ ] **Implement `CharacterCard` Component (AC: 1, 2)**
    - [ ] Create `CharacterCard` component in `app/game-play/components/`.
    - [ ] Implement visual states for "Active" and "Eliminated" (grayed out/flipped effect).
    - [ ] Integrate click handler to toggle state.
    - [ ] Ensure `CharacterCard` adheres to accessibility guidelines (keyboard navigation, focus states, screen reader support).
- [ ] **Integrate `CharacterCard` into `CharacterBoard` (AC: 1)**
    - [ ] Update `CharacterBoard` component to render `CharacterCard` instances.
    - [ ] Pass necessary props from `useGameStore` to `CharacterCard` for initial state.
- [ ] **Update `useGameStore` for Character Elimination State (AC: 2)**
    - [ ] Add state in `useGameStore` to track `eliminatedCharacterIds` (Set or Array).
    - [ ] Implement an action in `useGameStore` to toggle elimination status of a character.
    - [ ] Ensure local persistence of this state (Zustand).
- [ ] **Connect `CharacterCard` to `useGameStore` (AC: 1, 2)**
    - [ ] Dispatch the `toggleElimination` action from `CharacterCard`'s click handler.
    - [ ] `CharacterCard` should react to `useGameStore` state for its visual representation.
- [ ] **Implement "End Turn" Logic (AC: 3)**
    - [ ] Ensure "End Turn" button (likely in `GameClient.tsx` or `InteractionPanel.tsx`) correctly triggers turn transition. (Leverage learnings from Story 3.3 for turn management).
    - [ ] Verify `game_sessions.current_turn_player_id` updates via Realtime after turn end.
- [ ] **Testing (AC: 1-3)**
    - [ ] Unit test `useGameStore` actions for toggling elimination status.
    - [ ] UI Test: Verify `CharacterCard` visual state changes on click.
    - [ ] Integration Test: Verify "End Turn" correctly passes control to opponent.
    - [ ] Accessibility Test: Verify keyboard navigation and screen reader announcements for `CharacterCard`.

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
- [Source: docs/tech-spec-epic-3.md#Elimination] - Technical details on elimination.
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

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-4-character-elimination-mechanics.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
