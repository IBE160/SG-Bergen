# Story 4.1: Game Over Screens

**Status:** drafted
**Epic:** Epic 4 - Post-Game Experience
**Priority:** High

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

- [ ] Task 1: Implement Secure Result API (AC 3)
  - [ ] Create `app/api/game/[gameId]/result/route.ts`
  - [ ] Implement GET handler to check `status === 'finished'`
  - [ ] Query `players` table to find opponent's `character_id` (using server role if needed or RLS policy)
  - [ ] Return `{ winner_id, opponent_character: { name, image, id } }`
  - [ ] Add integration test ensuring API returns 403/404 if game not finished

- [ ] Task 2: Create Game Result UI Components (AC 1, AC 2)
  - [ ] Create `app/game-play/components/OpponentReveal.tsx` to display character card
  - [ ] Create `app/game-play/components/GameResultView.tsx` (Dialog or Overlay)
  - [ ] Implement conditional styling for Win vs Lose state
  - [ ] Add "Return to Menu" and "Play Again" placeholder buttons (functionality in next stories)

- [ ] Task 3: Integrate Result View into Game Board (AC 1, AC 4)
  - [ ] Update `app/game-play/page.tsx` or main Game component to conditionally render `GameResultView` based on `useGameStore.status`
  - [ ] Implement data fetching hook (e.g., `useGameResult`) to call the API when status becomes `finished`
  - [ ] Verify `useGameStore` persistence correctly restores the `finished` state on refresh

- [ ] Task 4: Verify UI & Latency (AC 1)
  - [ ] Manual test: Win a game and verify overlay appearance speed
  - [ ] Unit test: `GameResultView` renders correct message based on props

## Dev Notes

### Learnings from Previous Story

**From Story 3-6 (Status: done)**

- **Optimistic Updates**: The `winnerId` is already updated optimistically in `useGameStore`. Use this for immediate UI feedback while waiting for API data.
- **Persistence**: Zustand persistence is active. Ensure `GameResultView` relies on the stored `status` and `winnerId` so it survives refreshes.
- **Database Types**: `player_secrets` type definition was added. Use it when typing the API response.
- **Testing**: Follow the integration test patterns from `game-loop.test.ts`.

[Source: stories/3-6-tech-debt-cleanup.md]

### Technical Implementation Details

- **API Security**: The opponent's character ID is NOT available in the public `players` state during the game. The new API endpoint is the ONLY place this should be exposed, and strictly only when `game_session.status === 'finished'`.
- **Component Location**: Place `GameResultView` in `app/game-play/components/`.
- **Styling**: Use `shadcn/ui` `Dialog` or a custom full-screen `motion.div` overlay (framer-motion is available if installed, otherwise CSS transitions).

### Project Structure Alignment

- **New File**: `app/api/game/[gameId]/result/route.ts` (matches `api` structure)
- **New Component**: `app/game-play/components/GameResultView.tsx` (matches feature-sliced design)

### References

- [Tech Spec: Post-Game Experience](docs/sprint-artifacts/tech-spec-epic-4.md)
- [Architecture: Data Models](docs/architecture.md#data-architecture)
