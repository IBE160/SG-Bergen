# Real-time Turn Management Testing Strategy

## Overview
As we implement the Core Gameplay Loop (Epic 3), testing the synchronization of game state across clients is critical. The reliance on Supabase Realtime for turn management introduces complexity that requires a specific testing strategy beyond standard unit tests.

## 1. Core Game Logic (Unit Testing)
**Goal:** Verify that the game rules are correctly implemented, independent of the network layer.

*   **Scope:**
    *   Turn transitions (Player A -> Player B).
    *   Action validation (Is it this player's turn? Is the move legal?).
    *   Win condition evaluation (Guess Correct -> Win, Guess Wrong -> Lose/Next Turn).
    *   Character elimination logic.
*   **Tools:** Jest (Node environment).
*   **Approach:**
    *   Write pure functions for game state transitions.
    *   Test these functions with various state inputs (edge cases).

## 2. Real-time Synchronization (Integration Testing)
**Goal:** Verify that actions performed by one client are correctly broadcast and applied to other clients.

*   **Scope:**
    *   `subscribe` to game channel.
    *   `broadcast` events (e.g., `player-move`, `next-turn`).
    *   State updates in the Zustand store upon receiving events.
*   **Tools:** Jest + Custom Supabase Realtime Mocks.
*   **Approach:**
    *   **Mocking the Channel:** Create a robust mock for the Supabase `channel` object that allows simulating incoming messages (`channel.on(...).callback(payload)`).
    *   **Simulated Clients:** Instantiate two separate Zustand stores (or simplified client representations) in the test environment to represent "Host" and "Guest".
    *   **Flow Test:**
        1. "Host" performs an action -> triggers `send` on mock channel.
        2. Test harness intercepts `send` and triggers the `on('postgres_changes')` or `on('broadcast')` callback for the "Guest" store.
        3. Assert that "Guest" store state matches "Host" expectation.

## 3. Real-time Edge Cases
*   **Race Conditions:** What if two players act simultaneously? (Server-side validation required).
*   **Disconnection:** Handling `presence` state changes (Offline/Online).
*   **Late Join:** Ensuring full state sync (not just delta updates) when a player reconnects.

## 4. Proposed Test Helper Structure
Create a `RealtimeTestHarness` class/utility in `tests/helpers/` that:
*   Mocks `supabase.channel`.
*   Maintains a list of "subscribers" (mock clients).
*   When a "client" broadcasts, the harness distributes the payload to other subscribers.

## 5. Manual Verification Plan
*   **Dual-Browser Testing:** Standard procedure for verifying sync speed and visual correctness.
*   **Network Throttling:** Test behavior under slow network conditions (Developer Tools).

## Action Items
1.  Implement `RealtimeTestHarness` mock.
2.  Write unit tests for `game-logic` module before hooking up Realtime.
3.  Create integration test suite `tests/integration/game-loop.test.ts` using the harness.
