# Secure Secret Character Selection & Verification Design

## Problem Statement
In "Digital Guess Who", the identity of each player's chosen character must remain secret from their opponent. If the opponent's character ID is sent to the client (even if hidden in the UI), a technically savvy user could inspect the network traffic or application state to cheat.

## Security Requirement
**The opponent's `character_id` must NEVER be sent to the client.**

## Solution: Server-Authoritative Verification

### 1. Data Model
*   **`players` table:**
    *   `id` (PK)
    *   `user_id` (FK)
    *   `game_id` (FK)
    *   `character_id` (Int, Private) - The chosen character.
    *   `is_ready` (Boolean)

### 2. Row Level Security (RLS)
The `players` table needs strict RLS policies to prevent data leakage.
*   **Policy:** "Players can view their own secret data"
    *   `USING (auth.uid() = user_id)`
    *   Allows `SELECT` on all columns *for the user's own row*.
*   **Policy:** "Public view of players"
    *   This is tricky. Players need to know *who* the opponent is (username, avatar), but not their `character_id`.
    *   **Approach:**
        *   **Option A:** Use a separate `public_profiles` view or table that excludes sensitive columns.
        *   **Option B (Supabase Standard):** RLS policies generally apply to rows, not columns. Supabase/Postgres doesn't support Column-Level Security easily with RLS alone.
        *   **Recommended Approach:** Split the data or use a Security Definer View.
            *   Create a view `public_player_info` that selects `game_id`, `user_id`, `is_ready` from `players`, but *omits* `character_id`.
            *   Grant access to this view for game participants.
            *   Restrict access to the raw `players` table to only the owner (for `character_id`).

### 3. Gameplay Flow (Verification)

#### A. Character Selection
1.  Player selects character.
2.  Client sends `UPDATE players SET character_id = X WHERE user_id = me`.
3.  RLS allows this update.

#### B. Asking a Question ("Does your person wear a hat?")
1.  This is a social interaction/logic deduction. The system doesn't necessarily "know" the attributes in the DB for the MVP (unless we model all attributes).
2.  **MVP Flow:** Player A asks via chat/UI. Player B answers "Yes/No". Player A eliminates based on trust/honor system (Digital version of physical game).
3.  **Enhanced Flow (Attribute-Aware):** Client sends "Filter by Hat". Server *could* validate, but complex.

#### C. Making a Guess ("Is it Alice?")
1.  Player A guesses Character Y.
2.  **Client:** Sends request `POST /api/game/guess` `{ gameId, guessCharacterId }`.
3.  **Server (API Route):**
    *   Fetches Opponent's row (using Service Role key or robust RLS check).
    *   Compares `guessCharacterId` vs `opponent.character_id`.
    *   Returns `{ correct: boolean, winner: boolean }`.
4.  **Client:** Displays "Correct! You Win!" or "Wrong!".

### 4. Implementation Strategy (Epic 3)
1.  **Refine RLS:** Lock down `players` table. Only `auth.uid() = user_id` can SELECT `character_id`.
2.  **API Endpoint:** Implement `/api/game/guess` for secure verification.
3.  **Realtime:** Broadcast the *result* of the guess ("Player A guessed WRONG"), but not the secret value.

## Constraints & Edge Cases
*   **Reconnection:** When reconnecting, the client needs to know "Game State". The server must construct a sanitized state object that includes the player's own character but *excludes* the opponent's.
