# Story 2.3: Real-time Lobby & Player Readiness

Status: drafted

## Story

As a Player (Host or Guest),
I want to see when my opponent joins and signal when I am ready,
so that we can start the game at the same time.

## Acceptance Criteria

1.  **Given** I am in the Lobby
    **When** The other player joins
    **Then** The UI updates instantly to show their avatar/name (via Supabase Realtime)
2.  **When** I click "I'm Ready"
    **Then** My status updates to `is_ready: true`
    **And** The "Ready" button becomes disabled/green
3.  **When** Both players are `is_ready: true`
    **Then** The game automatically transitions to the Gameplay screen
4.  **Given** I am waiting for an opponent
    **When** The opponent disconnects or leaves the lobby
    **Then** The UI updates to remove their presence and reset the "Ready" state if applicable.

## Tasks / Subtasks

- [ ] **Implement Client-Side State & Realtime Logic (AC: 1, 4)**
  - [ ] Create `useLobbyStore` (Zustand) to manage player list and readiness.
  - [ ] Create `useGameSubscription` hook to subscribe to `game:[id]` channel.
  - [ ] Handle `INSERT` events on `players` table (new player joined).
  - [ ] Handle `DELETE` events or status updates for player leaving/disconnecting.
  - [ ] Update UI avatar/list instantly upon events.
- [ ] **Implement Player Readiness Interaction (AC: 2)**
  - [ ] Add "I'm Ready" button to Lobby UI.
  - [ ] Implement `toggleReady` function calling Supabase (update `players` set `is_ready = true`).
  - [ ] Disable button and show green state upon success.
- [ ] **Implement Game Start Transition (AC: 3)**
  - [ ] In `useGameSubscription`, listen for `UPDATE` on `players`.
  - [ ] Logic: If `players.length == 2` AND `all(p.is_ready)`, trigger navigation.
  - [ ] Redirect both users to `/game-play/[code]`.
- [ ] **Testing & Verification**
  - [ ] **Unit Test**: Test `useLobbyStore` state transitions.
  - [ ] **Manual Test**: Open two browsers. Join same game. Verify Player A sees Player B join. Verify Ready status syncs. Verify redirection.

## Dev Notes

### Learnings from Previous Story

**From Story 2.2: Join Game Functionality (Status: done)**

- **New Patterns**: `api/game/join` established the API pattern. `JoinGameForm` is the entry point.
- **Pending Review Items**:
  - [ ] [Low] Implement API rate limiting (from Story 2.2). Consider applying this to any new API routes created for readiness toggling if not using direct Supabase client calls.
- **Testing**: UI tests required mocking `global.fetch`. Keep this in mind if testing the Lobby UI.

### Technical Considerations

*   **Real-time Integration:** Utilize `Supabase Realtime` with a dedicated channel (e.g., `game:[game-id]`) for low-latency synchronization of player joining and readiness status. Events should transmit critical state updates.
*   **Client-Side State Management:** Implement a Zustand store to manage the lobby state, subscribing to Supabase Realtime events via custom hooks. Ensure proper subscription lifecycle (connect on mount, disconnect on unmount).
*   **Database Schema:** The `players` table will need an `is_ready` boolean field.
*   **User Experience:** Provide clear visual feedback for opponent's status ("Waiting for opponent...", "Opponent Ready") and the current player's readiness. Disable the "Ready" button once clicked.
*   **Edge Cases:** Handle scenarios where a player disconnects after clicking "Ready" but before game start. Ensure the remaining player is notified and the game doesn't hang.
*   **Security:** Rely on existing Supabase RLS policies for `players` table to ensure secure updates to `is_ready` status.
*   **Architecture:** Adhere to the feature-sliced design for lobby components.