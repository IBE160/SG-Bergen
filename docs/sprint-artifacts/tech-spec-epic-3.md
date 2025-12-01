# Epic Technical Specification: Core Gameplay Loop

Date: December 1, 2025
Author: BIP
Epic ID: 3
Status: Draft

---

## Overview

This epic covers the complete implementation of the core gameplay loop for "Digital Guess Who." It encompasses all functionality required for players to play the game from start to finish, including selecting their secret character, engaging in the turn-based question-and-answer cycle, visually eliminating characters on their board, and making a final guess to determine the winner. The primary goal is to create a stable, real-time, and interactive game experience that is faithful to the classic board game.

## Objectives and Scope

*   **In-Scope:**
    *   (FR2.1) Secret character selection by each player.
    *   (FR2.2) Usage of the base character pool.
    *   (FR3.1) Enforcement of turn-based play.
    *   (FR3.2) Interface for asking and answering yes/no questions.
    *   (FR3.3) Interactive character elimination on the player's board.
    *   (FR3.4) Mechanism for making a final guess and determining the win/loss condition.
*   **Out-of-Scope:**
    *   In-game chat functionality.
    *   AI-powered question hints.
    *   User-uploaded custom character sets.
    *   Persistent stat tracking or user accounts beyond session authentication.

## System Architecture Alignment

The implementation of this epic will heavily rely on the architecture defined in `architecture.md`.
*   **Real-time Engine:** `Supabase Realtime` is critical for managing turn changes, questions, and answers with low latency.
*   **State Management:** `Zustand` will be used to manage the client-side game state, including the local player's board (eliminated characters) and the current turn status.
*   **Project Structure:** All UI components will be located within the `app/game-play/` feature slice. This includes the `CharacterGrid` and `CharacterCard` components.
*   **Data Persistence:** The `db/schema.ts` defines the `moves` table, which will be used to log questions and answers. The `game_sessions` table will be updated to reflect the current turn and final win/loss status.

## Detailed Design

### Services and Modules

*   **`GamePlayService` (Zustand Store):** A client-side state management store responsible for holding the game state, including the character grid, which characters have been eliminated, the current turn, and any incoming questions from the opponent.
*   **`SupabaseRealtimeService` (Located in `lib/supabase`):** A utility module responsible for managing the connection to the Supabase Realtime channel for the current game. It will handle subscribing to the game channel and listening for key events like `turn-changed`, `question-asked`, and `answer-received`.
*   **`GameAPI` (Located in `app/api/game/[game-id]`):** A set of serverless functions for handling secure game actions that require server-side validation. The primary endpoint for this epic is `/guess` for validating a player's final guess against the opponent's secret character.
*   **UI Components (Located in `app/game-play/components`):**
    *   `CharacterGrid.tsx`: The main component that renders the grid of `CharacterCard` components.
    *   `CharacterCard.tsx`: An individual, interactive card representing a character, with states for "active" and "eliminated".
    *   `QuestionForm.tsx`: The UI for the active player to type and submit their question.

### Data Models and Contracts

The following data models, defined in `db/schema.ts`, are central to the core gameplay loop:

*   **`GameSession`:**
    *   `id` (UUID): The unique identifier for the game session.
    *   `status` (Enum: 'active', 'finished'): The current state of the game.
    *   `current_turn_player_id` (UUID): Foreign key to the `players` table, indicating whose turn it is.
    *   `winner_id` (UUID, nullable): Foreign key to the `players` table, populated when the game is `finished`.
*   **`Player`:**
    *   `id` (UUID): The unique identifier for a player within a session.
    *   `game_id` (UUID): Foreign key linking the player to a `GameSession`.
    *   `character_id` (Int): The ID of the player's secret character. This must be protected by RLS.
*   **`Move`:**
    *   `id` (UUID): The unique identifier for a single game move.
    *   `game_id` (UUID): Foreign key linking the move to a `GameSession`.
    *   `player_id` (UUID): Foreign key linking the move to the `Player` who made it.
    *   `action_type` (Enum: 'question', 'answer', 'guess'): The type of move being made.
    *   `details` (JSON): A flexible field to store the text of a question, the value of an answer ("yes"/"no"), or the character ID of a guess.

### APIs and Interfaces

*   **Server-Side API:**
    *   **Endpoint:** `POST /api/game/{game-id}/guess`
    *   **Purpose:** To securely validate a player's final guess.
    *   **Request Body:** `{ "characterId": number }`
    *   **Success Response:** `{ "data": { "correct": boolean } }`
    *   **Error Response:** `{ "error": { "message": "It is not your turn." | "Game not found." } }`

*   **Client-Side Realtime Interface (Supabase):**
    *   **Channel:** `game:{game-id}` (e.g., `game:1234-abcd`)
    *   **Events (Broadcasted by server-side actions):**
        *   **Event Name:** `turn-changed`
            *   **Payload:** `{ "nextPlayerId": "uuid-of-next-player" }`
        *   **Event Name:** `question-asked`
            *   **Payload:** `{ "question": "Is your character wearing a hat?" }`
        *   **Event Name:** `answer-received`
            *   **Payload:** `{ "answer": "yes" | "no" }`

### Workflows and Sequencing

The primary workflow for this epic is the **Question & Answer Cycle**, orchestrated by Supabase Realtime.

1.  **Player A's Turn (Asker):**
    a. The UI enables the `QuestionForm.tsx` component.
    b. Player A types a question and submits it.
    c. The client creates a new row in the `moves` table with `action_type: 'question'` and the question text in `details`.

2.  **Real-time Broadcast to Player B (Answerer):**
    a. Supabase's Realtime service automatically broadcasts the new `moves` record to all subscribers of the `game:{game-id}` channel.
    b. Player B's client receives the event via its `SupabaseRealtimeService`.
    c. The UI on Player B's screen updates to display the question and presents "Yes" and "No" buttons.

3.  **Player B Responds:**
    a. Player B clicks "Yes" or "No".
    b. The client creates a new row in the `moves` table with `action_type: 'answer'` and the response in `details`.

4.  **Real-time Broadcast back to Player A:**
    a. The new "answer" move is broadcast to Player A.
    b. Player A's UI updates to show the answer. The `GamePlayService` (Zustand store) now knows the answer.
    c. Player A can now click on characters in the `CharacterGrid.tsx` to toggle their "eliminated" state. This state change is managed purely on the client by Zustand.

5.  **Ending the Turn:**
    a. After eliminating characters, Player A clicks an "End Turn" button.
    b. This triggers an update to the `game_sessions` table, setting `current_turn_player_id` to Player B's ID.
    c. This update is broadcast via Realtime, and the `turn-changed` event is received by both players, causing their UIs to update accordingly (disabling/enabling forms). The cycle repeats.

## Non-Functional Requirements

### Performance

*   **Real-time Synchronization:** Game state changes (turn changes, questions, answers) communicated via Supabase Realtime must be synchronized between players with a latency of **less than 500ms**, as specified in the PRD.
*   **UI Responsiveness:** The character elimination mechanic (clicking a card to toggle its state) must feel instantaneous, with a visual response time **under 100ms**. This will be achieved by using a client-side Zustand store for optimistic UI updates.
*   **Efficient Data Transfer:** To minimize latency, Supabase Realtime event payloads will be kept small and focused, containing only the necessary data delta (e.g., the question text, the answer).

### Security

*   **Server-Side Guess Validation:** The final guess action must be validated on the server via the `POST /api/game/{game-id}/guess` endpoint. This prevents a malicious client from determining the opponent's character by inspecting client-side code or network traffic.
*   **Data Exposure:** Row Level Security (RLS) policies on the `players` table must be configured to prevent the `character_id` column from being exposed to the opposing player. Each player should only be able to read their own secret character ID.
*   **Action Authorization:** RLS policies on the `moves` table must ensure that a player can only insert moves (`action_type: 'question'`, `'answer'`, or `'guess'`) for games they are currently a part of and only when it is their turn (if possible within RLS constraints, otherwise validated in the API).

### Reliability/Availability

*   **Connection Handling:** The application must gracefully handle temporary network disruptions. The Supabase client library provides automatic reconnection logic. The UI should display a clear, non-intrusive notification to the user if the connection is lost.
*   **Opponent Disconnection:** As per the UX specification, if an opponent disconnects mid-game, the system should wait for a brief period (e.g., 30 seconds) for them to reconnect. If they fail to rejoin, the game ends, and the remaining player is declared the winner to prevent deadlocked games.

### Observability

*   **Structured Logging:** Key gameplay events should be logged with a structured format for easier debugging and analysis in Vercel Logs.
*   **Critical Events to Log:**
    *   `[INFO] [GameEngine] Game started { gameId: "..." }`
    *   `[INFO] [GameEngine] Turn changed { gameId: "...", nextPlayerId: "..." }`
    *   `[INFO] [GameEngine] Question asked { gameId: "...", playerId: "..." }`
    *   `[INFO] [GameEngine] Guess made { gameId: "...", playerId: "...", correct: boolean }`
    *   `[INFO] [GameEngine] Game over { gameId: "...", winnerId: "..." }`

## Dependencies and Integrations

The implementation of this epic relies on the following key libraries and integrations defined in `digital-guess-who/package.json`:

*   **Core Framework & Rendering:**
    *   `next`: The React framework used for server and client components.
    *   `react`, `react-dom`: The core library for building the user interface.

*   **Database & Real-time Communication:**
    *   `@supabase/supabase-js`: The primary integration point. This client library is essential for all interactions with the Supabase backend, including:
        *   Subscribing to the `game:{game-id}` Realtime channel.
        *   Receiving game events (`turn-changed`, `question-asked`, `answer-received`).
        *   Inserting records into the `moves` table.
        *   Updating the `game_sessions` table.
    *   `@supabase/ssr`: Used for managing user authentication state, which is a prerequisite for all authenticated game actions.

*   **Client-Side State Management:**
    *   `zustand`: (*To be installed*) As defined in the architecture, this library will be used to create the `GamePlayService` store for managing the local game state on the client, such as the board's elimination status and the current question.

*   **UI & Styling:**
    *   `tailwindcss`: Provides the utility classes for styling all game components.
    *   `@radix-ui/*`: A collection of unstyled, accessible component primitives that form the foundation of the UI.
    *   `lucide-react`: Provides icons used in the game interface.
    *   `class-variance-authority`, `clsx`, `tailwind-merge`: A set of utilities for creating flexible and conflict-free component styles.

## Acceptance Criteria (Authoritative)

This section translates the user stories from `epics.md` into a definitive, testable list of acceptance criteria for the Core Gameplay Loop.

1.  **Given** the game has started, **then** a grid of character cards is displayed, with the quantity matching the selected difficulty. (from Story 3.1)
2.  **Given** the character grid is displayed, **when** a player clicks a character to select it as their secret identity, **then** the selection is visually confirmed and securely saved to their player record. (from Story 3.1)
3.  **Given** both players have selected a character, **then** the main game interface activates, and the first turn is assigned. (from Story 3.1)
4.  **Given** it is a player's turn, **then** the UI elements for asking a question and making a guess are enabled, and a "Your Turn" indicator is visible. (from Story 3.2)
5.  **Given** it is the opponent's turn, **then** the action UI elements are disabled, and an "Opponent's Turn" indicator is visible. (from Story 3.2)
6.  **Given** it is the active player's turn, **when** they submit a question, **then** the opponent immediately receives the question via a real-time event. (from Story 3.3)
7.  **Given** an opponent has received a question, **when** they click "Yes" or "No", **then** the asking player immediately receives the answer via a real-time event, and the interaction is logged as a `move`. (from Story 3.3)
8.  **Given** a player has received an answer, **when** they click on a character card, **then** its state toggles to "Eliminated" (e.g., grayed out), and this state is preserved locally for the duration of the turn. (from Story 3.4)
9.  **Given** it is the player's turn, **when** they initiate a final guess and select a character, **then** the system performs a secure, server-side check against the opponent's secret character. (from Story 3.5)
10. **Given** a final guess has been made, **then** the game status updates to `finished`, the correct `winner_id` is set, and both players see the appropriate "You Win" or "You Lose" outcome. (from Story 3.5)

## Traceability Mapping

This table maps the acceptance criteria above to the relevant sections of this technical specification and the components involved, providing a clear path for implementation and testing.

| AC ID | Acceptance Criterion | Spec Section(s) | Component(s) / API(s) | Test Idea |
| :--- | :--- | :--- | :--- | :--- |
| 3.1.1 | Player sees a grid of character cards. | Detailed Design | `CharacterGrid.tsx` | Render the component and assert that the number of `CharacterCard` children matches the game's difficulty setting. |
| 3.1.2 | Player can select a secret character. | Data Models | `CharacterCard.tsx`, `players` table | Write a test that simulates a click on a card, verifies its visual state changes, and mocks the database call to ensure `character_id` is updated. |
| 3.2.1 | UI clearly indicates the current turn. | Detailed Design | `GamePlayService` (Zustand) | Mock the Zustand store's state for the current turn and assert that the correct "Your Turn" or "Opponent's Turn" text is rendered in the UI. |
| 3.3.1 | Asker can submit a question. | Workflows & Sequencing | `QuestionForm.tsx`, `moves` table | Simulate typing in the input and clicking "Ask". Verify that the mock function for inserting a `moves` record is called with `action_type: 'question'`. |
| 3.3.2 | Answerer receives the question and can respond. | APIs & Interfaces | `SupabaseRealtimeService` | Simulate a real-time event for an incoming question and assert that the "Yes" and "No" buttons are rendered and enabled. |
| 3.4.1 | Player can toggle the "Eliminated" state. | Detailed Design | `CharacterCard.tsx`, `GamePlayService` (Zustand) | Simulate a click on an active `CharacterCard` and assert that its visual style changes (e.g., a `data-eliminated="true"` attribute is present) and the Zustand store is updated. |
| 3.5.1 | Player can make a final guess. | APIs & Interfaces | `POST /api/game/{game-id}/guess` | Simulate the "Make a Guess" flow and assert that a `fetch` call is made to the correct API endpoint with the correct character ID in the request body. |
| 3.5.2 | System correctly identifies win/loss. | Workflows & Sequencing | `POST /api/game/{game-id}/guess` | Mock the API to return both correct and incorrect guess responses. Assert that the UI correctly renders the "You Win" or "You Lose" component for each case. |

## Risks, Assumptions, Open Questions

*   **Risk:** Real-time synchronization issues (e.g., dropped messages, race conditions) could lead to a de-synced game state between the two players.
    *   **Mitigation:** The primary mitigation is to rely on Supabase's at-least-once delivery guarantee for database-persisted events. For purely transient events, the UI should be designed to be resilient to occasional missed messages. A "resync" or page refresh can serve as a final manual recovery step for players.
*   **Risk:** A malicious player could attempt to cheat by reading the opponent's secret `character_id` from client-side data or by manipulating API calls.
    *   **Mitigation:** This is addressed by the architectural decision to use strict Row Level Security (RLS) policies to protect sensitive data and to validate all high-stakes actions (like the final guess) on the server-side via a dedicated API endpoint.
*   **Assumption:** The Supabase Realtime service will consistently meet the <500ms latency requirement under typical network conditions for a 2-player game.
    *   **Next Step:** Perform informal latency testing during development by playing the game across different network conditions (e.g., using browser dev tools to throttle network speed) to validate this assumption.
*   **Question:** What is the desired behavior if a player's browser tab goes into the background? Should the Realtime connection be maintained?
    *   **Decision:** For the MVP, we will rely on the default behavior of the Supabase client, which may pause or disconnect the Realtime subscription. When the tab is refocused, the client will automatically attempt to reconnect and the game state should be re-fetched to ensure consistency.

## Test Strategy Summary

The test strategy for this epic will be multi-layered to ensure quality from the component level to the complete user experience.

*   **Unit Tests (Jest / React Testing Library):**
    *   **Scope:** Individual React components and utility functions.
    *   **Examples:**
        *   Test the `CharacterCard` component to ensure it renders correctly in both "active" and "eliminated" states.
        *   Test the `GamePlayService` (Zustand store) to verify that actions like `eliminateCharacter` correctly modify the state.
        *   Test that UI components are disabled/enabled correctly based on whose turn it is.

*   **Integration Tests (Jest / React Testing Library):**
    *   **Scope:** Interactions between components and services within the `game-play` feature slice.
    *   **Examples:**
        *   Test that clicking the "Ask" button in `QuestionForm.tsx` correctly calls the function responsible for creating a `move` record.
        *   Mock the Supabase client to simulate incoming Realtime events (e.g., `question-asked`, `turn-changed`) and assert that the UI reacts as expected (e.g., displaying the question, updating the turn indicator).

*   **Manual Testing:**
    *   **Scope:** Verifying the end-to-end user experience and the "feel" of the real-time interaction, which is difficult to automate.
    *   **Process:** Two testers will manually play a full game against each other. This is critical for identifying subtle bugs, race conditions, or latency issues in the real-time synchronization that automated tests might miss. Testing should be performed under various simulated network conditions.
