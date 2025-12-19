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
review
