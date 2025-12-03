# Epic 4: Post-Game Experience - Technical Context

## Goals
Provide a polished conclusion to the game session, revealing the winner and the secret characters, and offering a seamless path to play again or return to the main menu.

## Core Architecture

-   **State Management:**
    -   The `game_session` table's `status` ('finished') and `winner_id` are the sources of truth.
    -   The `GamePlayPage` component already listens for these changes via Supabase Realtime.
    -   Zustand store holds the local UI state.

-   **Database:**
    -   `game_sessions`: `status` (enum: waiting, active, finished), `winner_id` (uuid).
    -   `players`: `character_id` (int) - Needs to be revealed at the end.

-   **Security (RLS):**
    -   The `players` table RLS policies currently prevent reading other players' secret `character_id`.
    -   **Challenge:** At game over, we want to show the opponent's character.
    -   **Solution:**
        -   Option A: Update RLS to allow reading `character_id` IF `game_sessions.status` is 'finished'.
        -   Option B: The "Make Guess" API response already returns the correct character ID. We can store this in the local state when the game ends.
        -   **Decision:** Option B is simpler for now. The "Make Guess" API returns `correctCharacterId`. We should pass this to the frontend. If the game ends via another method (e.g., forfeit - not in MVP), we might need Option A. For MVP, let's rely on the API response or a specific "reveal" RPC function if needed. actually, let's stick to Option A (RLS update) for robustness, so the client can just fetch the opponent's data once the game is finished.

## Stories Breakdown

1.  **4.1 Game Over Screens:** Polished UI overlay.
2.  **4.2 Play Again Functionality:** Logic to reset/create new game.
3.  **4.3 Return to Main Menu:** Navigation and state cleanup.

## Key Technical Components

-   **UI Components:**
    -   `GameOverOverlay.tsx`: A new component to display the result.
    -   `Confetti`: Optional visual flair.
-   **API/Data:**
    -   Supabase Policy Update: `policy "Allow participants to view players"` needs to condition visibility of `character_id` on `auth.uid() = user_id` OR `game_sessions.status = 'finished'`.

## Risk Assessment

-   **RLS Complexity:** Modifying the RLS policy to check a joined table (`game_sessions`) can be performant-heavy if not careful, but for single row lookups it's fine.
-   **State Sync:** Ensuring both players see the game over screen at the same time. The Realtime subscription handles this, but the "loser" needs to know *why* they lost (i.e., what the winner guessed or if they guessed wrong).

---
**Assessor:** Dev Agent
**Date:** 2025-12-03
