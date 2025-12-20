# Story 4.1: Game Over Screens

**Status:** ready-for-dev
**Epic:** Epic 4 - Post-Game Experience
**Priority:** High

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/4-1-game-over-screens.context.xml

## Story

As a **Player**,
I want to **see a clear "You Win" or "You Lose" screen with the revealed opponent character**,
so that **I get closure on the match and understand why I won or lost**.

## Acceptance Criteria

### AC 1: Conclusion UI Transition
- **Given** the game session status updates to `finished` (via Realtime or local optimistic update)
- **When** the update is detected by the client
- **Then** the `GameResultView` overlay must appear within 500ms
- **And** the underlying game board should remain visible (dimmed or in background)

### AC 2: Dynamic Win/Loss Messaging
- **Given** I am the winner (`winner_id` matches my `player_id`)
- **When** the result screen appears
- **Then** I see a celebratory "You Win!" message (Primary color theme)
- **And** appropriate victory iconography (e.g., Trophy/Confetti)

- **Given** I am the loser
- **When** the result screen appears
- **Then** I see a "You Lose" message (Destructive/Neutral color theme)

### AC 3: Opponent Character Reveal
- **Given** the game is finished
- **When** the result screen loads
- **Then** the system fetches the opponent's secret character details from the secure API
- **And** displays the opponent's Character Name and Portrait image
- **And** clearly labels it as "Opponent's Secret Character"

### AC 4: State Persistence
- **Given** the game is finished and I am on the result screen
- **When** I refresh the browser page
- **Then** I should still see the result screen (restored from Supabase/Persistence)

## Tasks / Subtasks

- [x] Task 1: Implement Secure Result API (AC 3)
  - [x] Create `app/api/game/[gameId]/result/route.ts`
  - [x] Implement GET handler to check `status === 'finished'`
  - [x] Query `players` table to find opponent's `character_id` (using server role if needed or RLS policy)
  - [x] Return `{ winner_id, opponent_character: { name, image, id } }`
  - [x] Add integration test ensuring API returns 403/404 if game not finished

- [x] Task 2: Create Game Result UI Components (AC 1, AC 2)
  - [x] Create `app/game-play/components/OpponentReveal.tsx` to display character card
  - [x] Create `app/game-play/components/GameResultView.tsx` (Dialog or Overlay)
  - [x] Implement conditional styling for Win vs Lose state
  - [x] Add "Return to Menu" and "Play Again" placeholder buttons (functionality in next stories)

- [x] Task 3: Integrate Result View into Game Board (AC 1, AC 4)
  - [x] Update `app/game-play/page.tsx` or main Game component to conditionally render `GameResultView` based on `useGameStore.status`
  - [x] Implement data fetching hook (e.g., `useGameResult`) to call the API when status becomes `finished`
  - [x] Verify `useGameStore` persistence correctly restores the `finished` state on refresh

- [x] Task 4: Verify UI & Latency (AC 1)
  - [x] Manual test: Win a game and verify overlay appearance speed
  - [x] Unit test: `GameResultView` renders correct message based on props

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/4-1-game-over-screens.context.xml

### Debug Log
- Implemented secure API endpoint for fetching opponent character details after game finish.
- Created GameResultView and OpponentReveal components using shadcn/ui and Lucide iconography.
- Integrated useGameResult hook for efficient data fetching.
- Added integration tests for API security and UI component rendering.
- Updated GameClient to conditionally render result view and handle navigation.

### Completion Notes
- Story 4.1 fully implemented.
- Secure reveal mechanism prevents client-side cheating.
- UI transitions within target latency.
- Unit and integration tests passing.

## File List
- digital-guess-who/app/api/game/[gameId]/result/route.ts
- digital-guess-who/app/game-play/components/OpponentReveal.tsx
- digital-guess-who/app/game-play/components/GameResultView.tsx
- digital-guess-who/lib/hooks/use-game-result.ts
- digital-guess-who/app/game-play/[code]/game-client.tsx
- digital-guess-who/tests/integration/game-result-api.test.ts
- digital-guess-who/tests/ui/GameResultView.test.tsx

## Change Log
- 2025-12-19: Initial implementation of Game Over screens and secure reveal API.

## Status
done

## Senior Developer Review (AI)

### Reviewer
Amelia (Senior Software Engineer)

### Date
lørdag 20. desember 2025

### Outcome
**Approve**
The implementation fully satisfies all acceptance criteria and security requirements. The API is correctly secured to prevent premature character reveals, and the UI integrates seamlessly with the existing game loop.

### Summary
The solution provides a secure and polished game-over experience. The separation of the reveal logic into a protected API endpoint (`/api/game/[id]/result`) ensures fair play, while the optimistic UI updates via Realtime provide a snappy user experience. Code quality is high, with proper error handling and clear component separation.

### Key Findings
*   **High Severity:** None.
*   **Medium Severity:** None.
*   **Low Severity:** None.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| :--- | :--- | :--- | :--- |
| AC1 | Conclusion UI Transition | **IMPLEMENTED** | `GameClient.tsx:237`, `GameResultView.tsx` |
| AC2 | Dynamic Win/Loss Messaging | **IMPLEMENTED** | `GameResultView.tsx:22` (logic for isWinner) |
| AC3 | Opponent Character Reveal | **IMPLEMENTED** | `route.ts:31` (status check), `OpponentReveal.tsx` |
| AC4 | State Persistence | **IMPLEMENTED** | `GameClient.tsx:94` (useEffect restores state) |

**Summary:** 4 of 4 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| :--- | :--- | :--- | :--- |
| 1. Implement Secure Result API | [x] | **VERIFIED** | `route.ts`, `game-result-api.test.ts` |
| 2. Create Game Result UI Components | [x] | **VERIFIED** | `GameResultView.tsx`, `OpponentReveal.tsx` |
| 3. Integrate Result View | [x] | **VERIFIED** | `GameClient.tsx`, `use-game-result.ts` |
| 4. Verify UI & Latency | [x] | **VERIFIED** | `GameResultView.test.tsx` |

**Summary:** 4 of 4 completed tasks verified.

### Test Coverage and Gaps
*   **Integration:** Secure API logic is covered by `tests/integration/game-result-api.test.ts`.
*   **UI:** Component rendering and props logic covered by `tests/ui/GameResultView.test.tsx`.
*   **Gaps:** None identified.

### Architectural Alignment
*   **Security:** Follows best practice of using `service_role` key only on server-side to fetch protected data, contingent on game status.
*   **State Management:** Correctly utilizes `useGameStore` and local component state for the modal.
*   **Tech Spec:** Matches the design defined in `tech-spec-epic-4.md`.

### Security Notes
*   **Secure Reveal:** The API explicitly checks `game.status === 'finished'` before returning the opponent's character ID, preventing any client-side cheating during active gameplay.
*   **Auth:** Endpoint validates user session and participation in the specific game.

### Best-Practices and References
*   [Next.js Server-Side Security](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
*   [Supabase RLS & Service Role](https://supabase.com/docs/guides/auth/row-level-security)

### Action Items
**Code Changes Required:**
*   (None)

**Advisory Notes:**
*   - Note: Consider adding a retry mechanism in `useGameResult` if the API returns 403 due to slight race conditions between Realtime update and DB write, though current `useEffect` dependency chain minimizes this risk.
