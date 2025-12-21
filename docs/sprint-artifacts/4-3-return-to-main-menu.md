# Story 4.3: Return to Main Menu

Status: drafted

## Story

As a **Player**,
I want to **leave the game and return to the start screen**,
so that **I can exit the session**.

## Acceptance Criteria
[Source: docs/epics.md#Story-4.3]

1. **Redirection:** When I click "Return to Main Menu", I am redirected to the home page (`/`).
2. **State Cleanup:** Local state in `useGameStore` and `useLobbyStore` is completely cleared to prevent data leaking into the next session.
3. **Availability:** The button is visible and active on the Game Result screen (once the game is `finished`).
4. **Clean Exit:** The Zustand stores are reset *before* or *immediately upon* navigation to ensure the next game starts from a blank slate.

## Tasks / Subtasks

- [ ] Task 1: Enhance Navigation Handler (AC 1, AC 2)
  - [ ] Update `handleReturnToMenu` in `GameClient.tsx` to call `useLobbyStore.getState().reset()` in addition to `useGameStore.getState().reset()`.
  - [ ] **Verify:** Unit test or console log confirming both stores are reset on click.
- [ ] Task 2: UI Verification (AC 3)
  - [ ] Ensure `GameResultView.tsx` correctly triggers `onReturnToMenu` when the "Return to Menu" button is clicked.
  - [ ] **Verify:** Manual click test on result screen.
- [ ] Task 3: Integration Testing (AC 2, AC 4)
  - [ ] Create `tests/integration/return-to-menu.test.ts` to assert that store states return to initial values after the handler is called.
  - [ ] **Verify:** Run `npm test tests/integration/return-to-menu.test.ts`.

## Dev Notes

### Architecture Patterns and Constraints
- **State Management:** Always use the defined `reset()` method in Zustand stores to ensure consistency with the initial state. [Source: docs/architecture.md#State-Management]
- **Navigation:** Standard Next.js `useRouter` is used for client-side transitions. [Source: docs/frontend-architecture.md#Routing]
- **Coding Standards:** Follow standard TypeScript and React patterns for component disposal and state cleanup. [Source: docs/coding-standards.md]

### Project Structure Notes
- **Components:** `GameResultView.tsx` handles the display; `GameClient.tsx` handles the logic. [Source: docs/unified-project-structure.md]
- **Stores:** Located in `digital-guess-who/lib/store/`.

### Learnings from Previous Story
**From Story 4.2: Play Again Functionality (Status: done)**

- **New Pattern Established**: `handlePlayAgain` successfully resets both `useGameStore` and `useLobbyStore`. `handleReturnToMenu` should be updated to match this pattern for consistency.
- **Architectural Deviation**: None.
- **Service Reuse**: Reuse `router.push('/')` pattern.
- **New Files Created**:
  - `digital-guess-who/app/api/game/[gameId]/play-again/route.ts`
  - `digital-guess-who/tests/integration/play-again.test.ts`
- **Files to Modify**:
  - `digital-guess-who/app/game-play/[code]/game-client.tsx`: Update `handleReturnToMenu` implementation.

[Source: stories/4-2-play-again-functionality.md#Dev-Agent-Record]

### References
- [Epic 4 Definition](docs/epics.md#Epic-4-Post-Game-Experience)
- [Post-Game Tech Spec](docs/sprint-artifacts/tech-spec-epic-4.md)
- [Unified Project Structure](docs/unified-project-structure.md)
- [Architecture](docs/architecture.md)
- [Testing Strategy](docs/testing-strategy.md)
- [Coding Standards](docs/coding-standards.md)

## Dev Agent Record

### Context Reference
<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used
Gemini 2.0 Flash Experimental

### Debug Log References

### Completion Notes List

### File List
