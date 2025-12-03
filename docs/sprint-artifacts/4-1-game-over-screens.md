# Story 4.1: Game Over Screens

Status: ready-for-dev

## Story

As a Player,
I want to see a clear "You Win" or "You Lose" screen with the revealed characters,
so that I get closure on the match.

## Acceptance Criteria

1.  **Given** the game has ended (status='finished'), **then** a Game Over overlay appears over the game board.
2.  **Given** I am the winner, **then** I see a celebratory message ("You Win!") and the opponent's secret character is revealed.
3.  **Given** I am the loser, **then** I see a message ("You Lose!") and the opponent's secret character is revealed.
4.  **And** the opponent's character card is displayed prominently.
5.  **And** I can still see the underlying game board (dimmed).

## Tasks / Subtasks

-   [ ] **Backend: RLS Update** (AC: #2, #3, #4)
    -   [ ] Update `players` table RLS policy to allow reading `character_id` for all participants IF the linked `game_sessions.status` is 'finished'. (Currently, it might be restricted or we rely on client filtering which is insecure, we want to enable secure reveal).
        -   *Refinement:* Actually, the current policy `Allow participants to view players` likely allows `select *` which includes `character_id`. We should verify if we previously restricted `character_id` column. If we didn't, it's already visible (which is a minor cheat risk we accepted for MVP). If we did restrict it, we need to open it up now.
        -   *Action:* Check current RLS. If needed, update. If we rely on client-side hiding, we just need to update the UI to show it.
-   [ ] **Frontend: State & Data**
    -   [ ] In `GamePlayPage`, when `status` becomes `finished`, fetch the opponent's `character_id` if not already known (or rely on the API result if we want to keep RLS strict).
    -   *Decision:* Let's update the RLS to be strict (hide during game) and open (reveal after game) for best practice.
-   [ ] **Frontend: UI Component (`GameOverOverlay`)** (AC: #1, #2, #3, #4, #5)
    -   [ ] Create `app/game-play/components/GameOverOverlay.tsx`.
    -   [ ] Props: `isWinner`, `opponentCharacter` (object), `onPlayAgain` (placeholder), `onMainMenu` (placeholder).
    -   [ ] Styling: Modal-like overlay, semi-transparent background.
-   [ ] **Frontend: Integration**
    -   [ ] Integrate `GameOverOverlay` into `GamePlayPage`.
    -   [ ] Remove the temporary "You Win/Lose" div created in Story 3.5.

## Dev Notes

-   **RLS Strategy:**
    -   Current policy: `create policy "Allow participants to view players" on public.players for select to authenticated using (game_id IN (SELECT game_id FROM public.players WHERE user_id = auth.uid()));`
    -   This allows selecting ALL columns. So `character_id` IS currently technically visible to a savvy user inspecting network requests.
    -   **Improvement:** We can leave it as is for this MVP Story to save time, OR we can try to use Postgres Column Level Security (not supported by standard Supabase UI policies easily, usually requires Views).
    -   **Pragmatic Approach:** For this story, we assume the client *has* access to the data. We just need to fetch/display it.
-   **UX:**
    -   Use `shadcn/ui` Card or Dialog for the overlay.
    -   Show the character image large.

## Change Log

- 2025-12-03: Initial draft.

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/4-1-game-over-screens.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
