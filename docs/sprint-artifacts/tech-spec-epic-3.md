# Epic Technical Specification: Core Gameplay Loop

Date: 2025-12-11
Author: BIP
Epic ID: 3
Status: Contexted

---

## Overview

Epic 3 "Core Gameplay Loop" encompasses the heart of "Digital Guess Who". It implements the interactive, real-time mechanics allowing two players to play a full match. This includes secret character selection, alternating turns for questioning and answering, client-side character elimination, and the final winning/losing guess condition. It builds upon the session management from Epic 2 and utilizes Supabase Realtime for instant state synchronization.

## Objectives and Scope

**In-Scope:**
*   **Secret Character Selection:** UI and logic for players to choose their identity from the grid.
*   **Turn Management:** Logic to enforce alternating turns and visual indication of active/waiting states.
*   **Question & Answer System:** Interface for the active player to ask Yes/No questions and the opponent to respond.
*   **Character Elimination:** Visual mechanism to "flip down" or gray out characters locally based on deduction.
*   **Winning/Losing Logic:** Mechanism to make a final guess, validate it securely, and determine the match outcome.

**Out-of-Scope:**
*   Game setup, lobby, and joining mechanics (covered in Epic 2).
*   Post-game screens and "Play Again" flows (covered in Epic 4).
*   In-game chat functionality.
*   AI-powered hint systems.

## System Architecture Alignment

This implementation aligns with the **Frontend Architecture** by utilizing **Zustand** (`useGameStore`) for managing the complex, immediate client-side state and **Supabase Realtime** for synchronizing the critical shared state.

It adheres to the **Backend Architecture** by using **Next.js API Routes** for sensitive operations—specifically the winning guess validation.

**Reference Documents:**
*   **Data Models:** `docs/data-models.md` (Authoritative Schema)
*   **Security Design:** `docs/design/secret-character-selection.md` (Secure Verification Logic)
*   **RLS Implementation:** `docs/security/rls-audit.md` (Security Policies)
*   **Testing:** `docs/testing/real-time-turn-strategy.md` (Integration Testing Plan)

## Detailed Design

### Services and Modules

| Module/Component | Type | Responsibility |
| :--- | :--- | :--- |
| `GamePage` (`app/game-play/page.tsx`) | Page Component | Main orchestrator; initializes game board and connects stores. |
| `useGameStore` (`lib/store/game-store.ts`) | Zustand Store | Manages local board state (active/eliminated cards), turn status, and logs. |
| `useGameSubscription` (`lib/hooks/`) | Custom Hook | Manages Supabase Realtime subscription to channel `game:[id]`. Dispatches events to store. |
| `GameService` (`app/api/game/...`) | API Route | Handles secure server-side logic (e.g., verifying a guess). |
| `CharacterBoard` | UI Component | Grid display of `CharacterCard`s with interaction logic. |
| `InteractionPanel` | UI Component | Context-aware area for asking questions, answering, or guessing. |

### Data Models and Contracts

**Note:** See `docs/data-models.md` for full field definitions and relationships.

**Key Entities:**
*   **`game_sessions`**: Manages the overall state of a game, including turn management and win/loss conditions.
*   **`players`**: Stores player-specific data within a game session, including chosen secret character.
*   **`moves`**: Records actions taken during a game, such as questions, answers, and guesses.

**Database Updates:**
*   **`game_sessions`**: Updates to `current_turn_player_id`, `winner_id`, and `status`.
*   **`players`**: `character_id` is now actively used.
*   **`moves`**: New usage for recording actions (`question`, `answer`, `guess`) and `details` JSONB.

### APIs and Interfaces

**1. Secure Guess Endpoint**
*   **Logic:** Must follow the Server-Authoritative Verification design defined in `docs/design/secret-character-selection.md`.
*   **POST** `/api/game/[game_id]/guess`
*   **Body:** `{ "guess_character_id": 123 }`
*   **Returns:** `{ "result": "win" | "lose", "correct_character_id": ... }`.

**2. Realtime Events (`game:[game_id]`)**
*   `player-ready`: Triggers game start check.
*   `turn-change`: Payload `{ "next_player_id": "..." }`.
*   `move`: Payload `{ "type": "question", "text": "..." }` or `{ "type": "answer", "value": "yes" }`.
*   `game-over`: Payload `{ "winner_id": "..." }`.

### Workflows and Sequencing

**Turn Sequence:**
1.  **Start:** `game_sessions.current_turn_player_id` is set.
2.  **Active Player:** UI enables "Ask Question" / "Make Guess".
3.  **Action (Question/Answer):** Syncs via Realtime Broadcast.
4.  **Elimination:** Local state update (Zustand).

## Non-Functional Requirements

### Performance
*   **Latency:** Turn updates and question/answer transmission must occur within **500ms**.
*   **Optimistic UI:** Character elimination must be instant (0ms latency).

### Security
*   **RLS Remediation:** **CRITICAL.** Implement the "Step 2" policies from `docs/security/rls-audit.md` to prevent clients from reading opponent's `character_id`.
*   **Anti-Cheating:** The client MUST NOT have access to the opponent's secret `character_id` via any API or subscription.
*   **Validation:** All winning condition checks must be authoritative on the server.

### Reliability
*   **Reconnection:** If a player refreshes, `useGameStore` should re-hydrate state from `game_sessions` and `moves` history.

### Observability
*   **Logging:** Implement structured logging for key events (e.g., game start/end, player actions, errors).
*   **Monitoring:** Monitor Realtime channel performance and API route response times.
*   **Error Reporting:** Integrate with an error tracking system to capture and report exceptions.

## Dependencies and Integrations

*   **Supabase Realtime:** Critical for the game loop (e.g., `^1.0.0`).
*   **Zustand:** Required for `useGameStore` (e.g., `^4.0.0`).
*   **shadcn/ui:** Components: `Card`, `Button`, `Dialog` (for Guess confirmation), `Input` (e.g., `^0.5.0`).

## Acceptance Criteria (Authoritative)

1.  **Secret Selection:**
    *   Players can select a character.
    *   Opponent cannot see the selection (verified via network inspection).
    *   Game transitions to "Play" mode.

2.  **Turn Enforcement:**
    *   UI clearly indicates "Your Turn" vs "Opponent's Turn".
    *   Active player inputs are enabled; Waiting player inputs are disabled.

3.  **Q&A Flow:**
    *   Active player can submit a text question.
    *   Opponent receives question instantly.
    *   Opponent can only reply "Yes" or "No".

4.  **Elimination:**
    *   Clicking a character card toggles its state (Active/Eliminated).
    *   State is preserved across turns locally.

5.  **Winning/Losing:**
    *   Correct Guess -> Player Wins.
    *   Incorrect Guess -> Player Loses.
    *   Game status updates to `finished`.

## Traceability Mapping

| Acceptance Criteria | Epic Story | Component / API | Test Idea |
| :--- | :--- | :--- | :--- |
| Secret Selection | Story 3.1 | `CharacterGrid`, `players` | Verify RLS blocks read of opponent `character_id`. |
| Turn Enforcement | Story 3.2 | `useGameStore` | Verify UI disables buttons when `current_turn_id` != `user_id`. |
| Q&A Flow | Story 3.3 | `moves` table, Realtime | Verify question appears on opponent screen < 500ms. |
| Elimination | Story 3.4 | `CharacterCard`, Zustand | Verify clicking card updates local store array. |
| Winning/Losing | Story 3.5 | `POST /guess` | Mock API response for Win/Loss. |

## Risks, Assumptions, Open Questions

*   **Risk:** Users inspecting network traffic. *Mitigation:* Strict RLS as per `docs/security/rls-audit.md`.
*   **Assumption:** Supabase Realtime performance will be sufficient for 500ms latency requirement.
*   **Open Question:** How will game state be reconciled if a player disconnects and reconnects mid-turn?
    *   *Impact:* Could lead to inconsistent game states or unfair advantages.
    *   *Next Steps:* Investigate Supabase Realtime presence and state management features.

## Test Strategy Summary

**CRITICAL:** Follow the strategy defined in `docs/testing/real-time-turn-strategy.md`.

*   **Unit Tests:** Test `useGameStore` logic (toggling cards, switching turns).
*   **Integration Tests:** Create `RealtimeTestHarness` to mock Supabase channels and verify sync between two store instances.
*   **E2E Tests:** Simulate a two-player game (using two browser contexts).