# Story 4.3: Return to Main Menu

Status: done

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

- [x] Task 1: Enhance Navigation Handler (AC 1, AC 2)
  - [x] Update `handleReturnToMenu` in `GameClient.tsx` to call `useLobbyStore.getState().reset()` in addition to `useGameStore.getState().reset()`.
  - [x] **Verify:** Unit test or console log confirming both stores are reset on click.
- [x] Task 2: UI Verification (AC 3)
  - [x] Ensure `GameResultView.tsx` correctly triggers `onReturnToMenu` when the "Return to Menu" button is clicked.
  - [x] **Verify:** Manual click test on result screen.
- [x] Task 3: Integration Testing (AC 2, AC 4)
  - [x] Create `tests/integration/return-to-menu.test.ts` to assert that store states return to initial values after the handler is called.
  - [x] **Verify:** Run `npm test tests/integration/return-to-menu.test.ts`.

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
- docs/sprint-artifacts/4-3-return-to-main-menu.context.xml

### Agent Model Used
Gemini 2.0 Flash Experimental

### Debug Log References

### Completion Notes List
- ✅ Implemented `useLobbyStore.reset()` in `handleReturnToMenu` to ensure full state cleanup.
- ✅ Added `tests/integration/return-to-menu.test.tsx` verifying both stores are reset and router redirects.
- ✅ Verified `GameResultView` correctly passes the handler.

### File List
- digital-guess-who/app/game-play/[code]/game-client.tsx
- digital-guess-who/tests/integration/return-to-menu.test.tsx

## Senior Developer Review (AI)

Reviewer: Amelia (AI Senior Developer)
Date: søndag 21. desember 2025
Outcome: **Approve**

### Summary
The implementation of the "Return to Main Menu" functionality is robust and follows the project's architectural standards. State cleanup is handled correctly for both game and lobby stores, ensuring no data leaks between sessions. The integration tests confirm the redirection and store reset logic.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| :--- | :--- | :--- | :--- |
| AC1 | Redirection: Redirect to home page (/) on click | IMPLEMENTED | `game-client.tsx:327` |
| AC2 | State Cleanup: Clear `useGameStore` and `useLobbyStore` | IMPLEMENTED | `game-client.tsx:325-326` |
| AC3 | Availability: Button visible on Game Result screen | IMPLEMENTED | `GameResultView.tsx:81`, `game-client.tsx:438` |
| AC4 | Clean Exit: Stores reset before/upon navigation | IMPLEMENTED | `game-client.tsx:325-327` |

Summary: 4 of 4 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| :--- | :--- | :--- | :--- |
| Task 1: Update `handleReturnToMenu` in `GameClient.tsx` | [x] | VERIFIED | `game-client.tsx:326` |
| Task 2: UI Verification in `GameResultView.tsx` | [x] | VERIFIED | `GameResultView.tsx:85` |
| Task 3: Integration Testing | [x] | VERIFIED | `return-to-menu.test.tsx` |

Summary: 3 of 3 completed tasks verified.

### Test Coverage and Gaps
- **Integration Tests:** `return-to-menu.test.tsx` verifies the core logic of store resets and navigation.
- **Manual Verification:** Recommended to verify the visual state of the button on the finished screen across different browsers.

### Architectural Alignment
- **State Management:** Correct use of `.getState().reset()` for immediate store cleanup.
- **Routing:** Correct use of `next/navigation` `useRouter`.

### Security Notes
- No security concerns identified. Cleanup of local state prevents sensitive game data (like secret character IDs) from persisting in the client state across sessions.

### Action Items
**Advisory Notes:**
- Note: Consider adding a confirmation modal if the player clicks "Return to Menu" *during* an active game to prevent accidental exits. (Future Enhancement)
- Note: Ensure `sonner` toasts are cleared if they were active during transition. (Minor UX)

