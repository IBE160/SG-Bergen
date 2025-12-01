# Story 3.1: Game Board & Secret Character Selection

Status: ready-for-dev

## Story

As a Player,
I want to see the grid of characters and select my secret identity,
So that the game can begin.

## Acceptance Criteria

1.  **AC1 (Character Grid Display):**
    -   **Given** the game has started and I am on the gameplay screen,
    -   **Then** I see a grid of character cards.
    -   **And** the number of cards corresponds to the difficulty selected in the lobby (Easy: 12, Medium: 24, Hard: 48).

2.  **AC2 (Secret Character Selection):**
    -   **Given** the character grid is displayed,
    -   **When** I click on a character card,
    -   **Then** the card is visually highlighted to indicate it is my selection.
    -   **And** a "Confirm Selection" button becomes active.

3.  **AC3 (Selection Confirmation):**
    -   **Given** I have selected a character,
    -   **When** I click "Confirm Selection",
    -   **Then** my selection is saved to my `players` record in the database (`character_id`).
    -   **And** my selection UI is locked (I cannot change my character).
    -   **And** I see a "Waiting for opponent to select..." message.

4.  **AC4 (Game Activation):**
    -   **Given** both players have confirmed their secret characters,
    -   **Then** the "Waiting for opponent" message disappears.
    -   **And** the main game interface becomes active.
    -   **And** the turn indicator shows whose turn it is (randomly assigned or Host first).

## Tasks / Subtasks

-   [ ] **Backend: Secure Character Selection** (AC: 3)
    -   [ ] Refine RLS policy on `players` table to allow a user to update ONLY their own `character_id` and only if it is currently `null`.
    -   [ ] Ensure the RLS policy for `SELECT` on the `players` table does NOT expose the `character_id` to the opponent.

-   [ ] **Frontend: Character Data Fetching** (AC: 1)
    -   [ ] Create a service or utility function to fetch the character set based on the game's difficulty setting. For MVP, this can be from a static JSON file in `public/assets/data/characters.json`.
    -   [ ] Define the TypeScript type for a `Character`.

-   [ ] **Frontend: Create Game Board UI Components** (AC: 1, 2)
    -   [ ] Create a `CharacterCard` component at `app/game-play/components/CharacterCard.tsx`. It should have visual states for `default`, `selected`, and `eliminated`.
    -   [ ] Create a `CharacterGrid` component at `app/game-play/components/CharacterGrid.tsx` that fetches the character data and renders the `CharacterCard` components in a grid layout.

-   [ ] **Frontend: Implement State Management (Zustand)** (AC: 2, 3, 4)
    -   [ ] Create a new Zustand store at `app/game-play/store.ts` to manage the game state.
    -   [ ] State should include `characters`, `mySecretCharacter`, `opponentSecretCharacter` (which will remain null), `turn`, and `gameState` (e.g., 'selecting', 'playing', 'finished').
    -   [ ] Implement actions for `selectCharacter`, `confirmCharacter`, and to handle real-time updates.

-   [ ] **Frontend: Implement Real-time Synchronization** (AC: 4)
    -   [ ] In the `app/game-play/page.tsx` component, subscribe to the `game:[gameId]` channel.
    -   [ ] Listen for an event (e.g., `opponent-ready`) that signals the other player has selected their character.
    -   [ ] When both players are ready, update the Zustand store to change the `gameState` to `playing` and set the initial `turn`.

-   [ ] **Testing** (AC: 1, 2, 3, 4)
    -   [ ] Write unit tests for the `GamePlayStore` to verify character selection and state transitions (AC: 2, 3, 4).
    -   [ ] Write unit tests for the `CharacterGrid` and `CharacterCard` components to verify correct rendering based on difficulty and selection state (AC: 1, 2).
    -   [ ] Write integration tests to simulate real-time `opponent-ready` events and verify the game state transitions to 'playing' (AC: 4).
    -   [ ] Create a placeholder for future E2E tests to simulate two users selecting characters and the game starting.

## Dev Notes

-   **Architecture:** This story implements the first part of the Core Gameplay Loop. It will heavily rely on a new `GamePlayStore` (Zustand) for client state and Supabase Realtime for synchronizing the "ready" state for character selection.
-   **Security:** It is CRITICAL that the opponent's secret character ID is never exposed to the client. The RLS policy must be strictly enforced. We will rely on server-side logic (or tightly scoped RLS) for the final guess validation in a later story. [Source: docs/architecture.md#Security-Architecture]
-   **Component Structure:** All new UI components for this feature should reside within `app/game-play/components/`.

### Learnings from Previous Story
*From Story 2.3 (Real-time Lobby & Player Readiness)*
-   **Reuse Real-time Pattern:** Continue using the `Supabase Realtime` channel pattern (`game:[gameId]`) established in the lobby for synchronizing game state.
-   **Reuse State Management Pattern:** Continue using `Zustand` for client-side state management. The new `GamePlayStore` will be analogous to the `LobbyStore`.
-   **Address Technical Debt:** While implementing tests, remember that E2E tests are a known gap in the project. Document the need for an E2E test case for this story.

#### Unresolved Review Items from Previous Story
-   **Note:** The following low-severity items from the review of story 2.3 are still pending. While not blockers for this story, they should be addressed in a future refactoring task to improve overall code quality.
    -   `[Low] Refine Player type definition for robustness.`
    -   `[Low] Replace console.error with a production-grade logging solution.`
-   [Source: docs/sprint-artifacts/2-3-real-time-lobby-player-readiness.md#Dev-Agent-Record]

### Project Structure Notes
-   This story's work is primarily located in the `app/game-play/` feature slice, following the established project structure.
-   The character data source will be a static file for now, but the architecture should allow for fetching from a DB later.

### References
-   [Source: docs/sprint-artifacts/tech-spec-epic-3.md]
-   [Source: docs/epics.md#Story-3.1]
-   [Source: docs/architecture.md#Project-Structure]
-   [Source: docs/ux-design-specification.md#Component-Library] (for `CharacterCard` design)

## Dev Agent Record

### Context Reference
- [Context: ./3-1-game-board-secret-character-selection.context.xml]

### Agent Model Used
gemini-cli-agent/1.0

### Debug Log References

### Completion Notes List

### File List

## Story

As a Player,
I want to see the grid of characters and select my secret identity,
So that the game can begin.

## Acceptance Criteria

1.  **AC1 (Character Grid Display):**
    -   **Given** the game has started and I am on the gameplay screen,
    -   **Then** I see a grid of character cards.
    -   **And** the number of cards corresponds to the difficulty selected in the lobby (Easy: 12, Medium: 24, Hard: 48).

2.  **AC2 (Secret Character Selection):**
    -   **Given** the character grid is displayed,
    -   **When** I click on a character card,
    -   **Then** the card is visually highlighted to indicate it is my selection.
    -   **And** a "Confirm Selection" button becomes active.

3.  **AC3 (Selection Confirmation):**
    -   **Given** I have selected a character,
    -   **When** I click "Confirm Selection",
    -   **Then** my selection is saved to my `players` record in the database (`character_id`).
    -   **And** my selection UI is locked (I cannot change my character).
    -   **And** I see a "Waiting for opponent to select..." message.

4.  **AC4 (Game Activation):**
    -   **Given** both players have confirmed their secret characters,
    -   **Then** the "Waiting for opponent" message disappears.
    -   **And** the main game interface becomes active.
    -   **And** the turn indicator shows whose turn it is (randomly assigned or Host first).

## Tasks / Subtasks

-   [ ] **Backend: Secure Character Selection** (AC: 3)
    -   [ ] Refine RLS policy on `players` table to allow a user to update ONLY their own `character_id` and only if it is currently `null`.
    -   [ ] Ensure the RLS policy for `SELECT` on the `players` table does NOT expose the `character_id` to the opponent.

-   [ ] **Frontend: Character Data Fetching** (AC: 1)
    -   [ ] Create a service or utility function to fetch the character set based on the game's difficulty setting. For MVP, this can be from a static JSON file in `public/assets/data/characters.json`.
    -   [ ] Define the TypeScript type for a `Character`.

-   [ ] **Frontend: Create Game Board UI Components** (AC: 1, 2)
    -   [ ] Create a `CharacterCard` component at `app/game-play/components/CharacterCard.tsx`. It should have visual states for `default`, `selected`, and `eliminated`.
    -   [ ] Create a `CharacterGrid` component at `app/game-play/components/CharacterGrid.tsx` that fetches the character data and renders the `CharacterCard` components in a grid layout.

-   [ ] **Frontend: Implement State Management (Zustand)** (AC: 2, 3, 4)
    -   [ ] Create a new Zustand store at `app/game-play/store.ts` to manage the game state.
    -   [ ] State should include `characters`, `mySecretCharacter`, `opponentSecretCharacter` (which will remain null), `turn`, and `gameState` (e.g., 'selecting', 'playing', 'finished').
    -   [ ] Implement actions for `selectCharacter`, `confirmCharacter`, and to handle real-time updates.

-   [ ] **Frontend: Implement Real-time Synchronization** (AC: 4)
    -   [ ] In the `app/game-play/page.tsx` component, subscribe to the `game:[gameId]` channel.
    -   [ ] Listen for an event (e.g., `opponent-ready`) that signals the other player has selected their character.
    -   [ ] When both players are ready, update the Zustand store to change the `gameState` to `playing` and set the initial `turn`.

-   [ ] **Testing** (AC: 1, 2, 3, 4)
    -   [ ] Write unit tests for the `GamePlayStore`.
    -   [ ] Per learnings from the previous story, create a placeholder for future E2E tests to simulate two users selecting characters and the game starting.

## Dev Notes

-   **Architecture:** This story implements the first part of the Core Gameplay Loop. It will heavily rely on a new `GamePlayStore` (Zustand) for client state and Supabase Realtime for synchronizing the "ready" state for character selection.
-   **Security:** It is CRITICAL that the opponent's secret character ID is never exposed to the client. The RLS policy must be strictly enforced. We will rely on server-side logic (or tightly scoped RLS) for the final guess validation in a later story. [Source: docs/architecture.md#Security-Architecture]
-   **Component Structure:** All new UI components for this feature should reside within `app/game-play/components/`.

### Learnings from Previous Story
*From Story 2.3 (Real-time Lobby & Player Readiness)*
-   **Reuse Real-time Pattern:** Continue using the `Supabase Realtime` channel pattern (`game:[gameId]`) established in the lobby for synchronizing game state.
-   **Reuse State Management Pattern:** Continue using `Zustand` for client-side state management. The new `GamePlayStore` will be analogous to the `LobbyStore`.
-   **Address Technical Debt:** While implementing tests, remember that E2E tests are a known gap in the project. Document the need for an E2E test case for this story.
-   [Source: docs/sprint-artifacts/2-3-real-time-lobby-player-readiness.md#Dev-Agent-Record]

### Project Structure Notes
-   This story's work is primarily located in the `app/game-play/` feature slice, following the established project structure.
-   The character data source will be a static file for now, but the architecture should allow for fetching from a DB later.

### References
-   [Source: docs/epics.md#Story-3.1]
-   [Source: docs/architecture.md#Project-Structure]
-   [Source: docs/ux-design-specification.md#Component-Library] (for `CharacterCard` design)

## Dev Agent Record

### Context Reference
<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used
gemini-cli-agent/1.0

### Debug Log References

### Completion Notes List

### File List
