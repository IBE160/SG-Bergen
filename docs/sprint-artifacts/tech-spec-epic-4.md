# Epic Technical Specification: Post-Game Experience

Date: fredag 19. desember 2025
Author: BIP
Epic ID: 4
Status: Draft

---

## Overview

The "Post-Game Experience" epic focuses on the critical final phase of the Digital Guess Who gameplay loop. It transitions players from the high-stakes moment of a final guess to a clear, engaging conclusion. This epic ensures that winners feel celebrated, losers understand why they lost (by revealing the opponent's character), and both players are provided with intuitive pathways to either play again or return to the main menu, thereby maximizing player retention and session engagement.

## Objectives and Scope

**In-Scope:**
- Implementation of the "You Win" and "You Lose" result screens.
- Reveal of the opponent's secret character (name and portrait) upon game conclusion.
- "Play Again" functionality that allows players to restart a session with the same opponent.
- "Return to Main Menu" navigation that safely exits the game session and resets local state.
- Real-time synchronization of the game-over state to both players.

**Out-of-Scope:**
- Social sharing features for game results.
- Global leaderboards or long-term stat tracking (Post-MVP).
- Complex tournament brackets.

## System Architecture Alignment

This epic aligns with the established Next.js + Supabase architecture by utilizing Supabase Realtime to broadcast the `game-over` state and `winner_id`. The UI will transition based on the `game_session` status in the Zustand `useGameStore`. Navigation will leverage Next.js `Link` and `router` for efficient page transitions, while cleanup logic will ensure the `useGameStore` is reset upon returning to the main menu.

## Detailed Design

### Services and Modules

| Service/Module | Responsibility | Owner |
| :--- | :--- | :--- |
| `GameResultView` | Main container for game-over UI; conditionally renders win/loss states. | Frontend |
| `OpponentReveal` | Displays the opponent's secret character portrait and name. | Frontend |
| `PostGameActions` | Renders "Play Again" and "Return to Menu" buttons with logic. | Frontend |
| `useGameStore` | Manage local cleanup and transition to new game sessions. | Store (Zustand) |
| `GameCompletionAPI` | Server-side logic to finalize sessions and initialize "Play Again" rooms. | Backend |

### Data Models and Contracts

**Database Updates (Logical):**
- **GameSession:**
    - `status`: enum (`waiting`, `active`, `finished`)
    - `winner_id`: UUID (references `players.id`)
- **Player Secrets (Revealed):**
    - The `character_id` of the opponent is fetched from the server once the game status is `finished`.

**Client State (Zustand):**
- `isGameOver`: boolean
- `winnerId`: string | null
- `opponentSecretCharacter`: Object | null

### APIs and Interfaces

| Method | Path | Description | Response Model |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/game/[id]/result` | Fetch finalized game details including revealed character. | `{ winner_id: string, opponent_character: Character }` |
| `POST` | `/api/game/[id]/play-again` | Initialize a new session with the same players. | `{ new_game_code: string }` |

### Workflows and Sequencing

1. **Detection:** Supabase Realtime detects `game_sessions` update to `status: finished`.
2. **State Update:** `useGameStore` updates local state, triggering the overlay of `GameResultView`.
3. **Data Fetch:** Client calls `/api/game/[id]/result` to get the opponent's secret character details (to avoid client-side cheating before the game ends).
4. **Interaction (Return):** User clicks "Return to Menu" -> `store.reset()` -> `router.push('/')`.
5. **Interaction (Play Again):**
    - Host clicks "Play Again".
    - `/api/game/[id]/play-again` creates new session.
    - Host broadcasts `REJOIN_NEW_GAME` event with code via Realtime.
    - Both clients redirect to the new lobby.

## Non-Functional Requirements

### Performance

- **Sync Latency:** Game-over transition must occur within 500ms of the server-side update.
- **Asset Loading:** Opponent character portraits should be prefetched or cached to ensure immediate reveal.
- **Interaction:** Button clicks for "Play Again" or "Menu" must respond within 100ms.

### Security

- **Server-Side Verification:** The opponent's secret character MUST NOT be revealed to the client until the game status is confirmed as `finished` in the database.
- **Authorization:** Only authenticated players who were part of the session can access the `/api/game/[id]/result` endpoint.
- **Anti-Griefing:** Ensure that clicking "Play Again" multiple times does not spam the database with redundant sessions.

### Reliability/Availability

- **State Persistence:** If a user refreshes the page during the win/loss screen, they should still see the result screen as long as the session status is `finished`.
- **Graceful Disconnect:** If one player leaves the result screen, the other player should still be able to use the "Play Again" feature (which would then act as a new game invitation).

### Observability

- **Logs:** Log all game completions with session IDs and duration.
- **Metrics:** Track the usage of "Play Again" vs. "Return to Menu" to measure engagement.
- **Errors:** Capture and log any failures in the "Play Again" session initialization.

## Dependencies and Integrations

| Dependency | Purpose | Integration Point |
| :--- | :--- | :--- |
| **Next.js (App Router)** | Framework for routing and rendering. | `app/game-play/` navigation. |
| **Supabase JS / SSR** | Real-time state synchronization and DB access. | `useGameSubscription`, API routes. |
| **Zustand** | Global client state management. | `useGameStore` for result state. |
| **shadcn/ui (Radix)** | UI components (Buttons, Dialogs). | Result screen overlays and action buttons. |
| **Lucide React** | Visual iconography. | Win/Loss icons. |
| **Sonner** | Feedback notifications. | "Opponent ready for new game" toasts. |

## Acceptance Criteria (Authoritative)

1. **Conclusion UI:** When the `game_sessions` status transitions to `finished`, the active UI must switch to the result screen within 500ms.
2. **Dynamic Messaging:** The winner must see a celebratory "You Win!" message, and the loser must see a clear "You Lose!" message.
3. **Character Reveal:** The opponent's secret character name and portrait must be displayed to both players on the result screen.
4. **Clean Exit:** Clicking "Return to Main Menu" must clear the Zustand `useGameStore` and redirect the player to the root `/` page.
5. **Session Continuity:** Clicking "Play Again" must successfully initialize a new game room and trigger a redirection for the opponent.
6. **State Persistence:** The result screen must be re-rendered correctly if a player refreshes their browser, as long as the session status remains `finished`.

## Traceability Mapping

| AC | Spec Section | Component(s)/API(s) | Test Idea |
| :--- | :--- | :--- | :--- |
| AC1 | Detailed Design | `GameResultView` | Monitor Realtime channel and verify component mount on status change. |
| AC2 | Detailed Design | `GameResultView` | Assert text content matches player's win/loss state based on `winner_id`. |
| AC3 | APIs & Interfaces | `/api/game/[id]/result` | Verify character data is NOT in the initial game state but IS in the result API. |
| AC4 | Workflows | `useGameStore.reset()` | Mock `router.push` and verify store state is empty after clicking menu button. |
| AC5 | Workflows | `/api/game/[id]/play-again` | Verify host can trigger new session and guest receives broadcasted code. |
| AC6 | Reliability | `Zustand persist` | Set state to `finished`, refresh browser, and ensure result screen is visible. |

## Risks, Assumptions, Open Questions

- **Risk (Race Condition):** If both players attempt to trigger "Play Again" at the same time, multiple sessions might be created.
    - *Mitigation:* Only allow the Host to trigger the initial "Play Again" API call.
- **Risk (Data Leak):** Opponent's character revealed too early.
    - *Mitigation:* Ensure the `character_id` is only returned by the result API when `status === 'finished'`.
- **Assumption:** Players prefer to keep the same difficulty settings when choosing "Play Again".
- **Question:** Should we implement a "Rematch Request" that the opponent must accept?
    - *Decision:* For MVP, the "Play Again" action by the host will act as an immediate invitation/redirection for the guest.

## Test Strategy Summary

- **Unit Testing:**
    - Test `useGameStore` to ensure `status` changes correctly trigger the result view.
    - Test state cleanup functions to ensure no data leaks between sessions.
- **Integration Testing:**
    - Verify `/api/game/[id]/result` returns the correct character data only after game completion.
    - Verify `/api/game/[id]/play-again` creates a valid new session linked to the same players.
- **E2E Testing:**
    - Use Playwright/Cypress to simulate two players: Player A guesses correctly -> Both see results -> Host clicks Play Again -> Both land in new lobby.
- **Manual Verification:**
    - Cross-browser testing (Chrome/Firefox) to ensure real-time sync is within latency targets.
