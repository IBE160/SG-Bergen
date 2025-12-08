# Tech Spec: Epic 2 - Game Session Management

> **Epic ID:** 2
> **Title:** Game Session Management
> **Status:** Contexted
> **Last Updated:** Monday, December 8, 2025

---

## 1. Overview and Scope

### Summary
This epic focuses on the core "handshake" of the game: allowing a host to create a session and a guest to join it. It creates the virtual room where the game happens. By leveraging Supabase for data persistence and Realtime for instant status updates, we ensure a seamless connection experience. The scope includes the lobby UI, game code generation, and the "ready up" mechanism that transitions players into the actual gameplay loop.

### In-Scope
*   **Game Creation:** Generating a unique, sharable game code.
*   **Lobby UI:** A waiting room interface displaying player status.
*   **Joining Mechanism:** Validating codes and connecting a second player.
*   **Real-time Updates:** Instantly reflecting when a player joins or changes readiness.
*   **Difficulty Selection:** Persisting the chosen difficulty level (Easy/Medium/Hard) to the session.
*   **Transition:** Automatically moving to the gameplay screen when both players are ready.

### Out-of-Scope
*   **Gameplay Mechanics:** Actual turns, questions, and guessing (Epic 3).
*   **User Accounts:** Persistent profiles or stats (handled by Auth, but deep integration is Post-MVP).
*   **Chat:** In-lobby chat functionality.
*   **Spectator Mode:** Allowing 3rd parties to watch.

### Architecture Alignment
*   **Frontend:** `app/game-lobby/` feature slice using `shadcn/ui` components.
*   **State:** Zustand store (`useLobbyStore`) for transient lobby state; Supabase for persistence.
*   **Backend:** `game_sessions` and `players` tables in Supabase.
*   **Realtime:** Supabase Realtime channel `game:[id]` for syncing "Player Joined" and "Ready" events.

---

## 2. Detailed Design

### Services & Modules

| Module | Responsibility | Inputs | Outputs | Owner |
| :--- | :--- | :--- | :--- | :--- |
| **GameService** (`lib/game/service.ts`) | Wraps Supabase calls for creating/joining games. | `userId`, `difficulty`, `gameCode` | `GameSession` object, `Player` object | Frontend |
| **LobbyStore** (`lib/store/lobby.ts`) | Manages local UI state for the lobby (players list, ready status). | Realtime events, User actions | UI State (isLoading, error, players[]) | Frontend |
| **LobbyPage** (`app/game/[code]/page.tsx`) | Main UI container for the lobby experience. | `params.code` | Rendered UI | Frontend |
| **CodeGenerator** (`lib/utils.ts`) | Generates short, readable unique codes. | None | String (e.g., "A7X9") | Shared |

### Data Models

**Table:** `game_sessions`
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: `gen_random_uuid()` | Unique internal ID |
| `code` | Text | Unique, Not Null | Public shareable code (e.g., "ABCD") |
| `host_id` | UUID | FK -> `auth.users.id` | The creator of the game |
| `status` | Enum | `waiting` (default), `active`, `finished` | Lifecycle state |
| `difficulty` | Enum | `easy`, `medium`, `hard` | Game configuration |
| `created_at` | Timestamptz | Default: `now()` | Audit |

**Table:** `players`
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: `gen_random_uuid()` | Unique player entry ID |
| `game_id` | UUID | FK -> `game_sessions.id` | The session they are in |
| `user_id` | UUID | FK -> `auth.users.id` | The authenticated user |
| `is_ready` | Boolean | Default: `false` | Readiness status |
| `character_id`| Int | Nullable (set in Epic 3) | Selected secret character |

### APIs & Interfaces

**1. Create Game**
*   **Method:** `POST /api/game/create` (or direct Supabase `insert`)
*   **Request:** `{ difficulty: 'easy' | 'medium' | 'hard' }`
*   **Response:** `{ gameId: '...', code: 'ABCD' }`
*   **Logic:** Generate unique code -> Insert into `game_sessions` -> Insert host into `players`.

**2. Join Game**
*   **Method:** `POST /api/game/join` (or direct Supabase `rpc`)
*   **Request:** `{ code: 'ABCD' }`
*   **Response:** `{ gameId: '...', playerId: '...' }`
*   **Logic:** Find session by code -> Check if full (max 2 players) -> Check if status is `waiting` -> Insert guest into `players`.

**3. Set Ready**
*   **Method:** `PATCH /players/[id]` (Direct Supabase update)
*   **Request:** `{ is_ready: true }`
*   **Realtime:** Triggers `UPDATE` event on `players` table.

### Workflows (Sequence)

**Scenario: Host Starts Game**
1.  **Host** clicks "Create Game (Easy)".
2.  **App** calls `GameService.create('easy')`.
3.  **DB** creates session "123" with code "XYZ", adds Host to `players`.
4.  **App** redirects Host to `/game/XYZ`.
5.  **Host UI** subscribes to `game:123` channel.

**Scenario: Guest Joins**
1.  **Guest** enters "XYZ" on home screen.
2.  **App** calls `GameService.join('XYZ')`.
3.  **DB** checks validation -> adds Guest to `players`.
4.  **Realtime** broadcasts `INSERT` on `players` table to Host.
5.  **Host UI** updates to show "Guest Joined".
6.  **Guest** redirected to `/game/XYZ`.

---

## 3. Non-Functional Requirements

### Performance
*   **Lobby Sync:** Player joining/ready updates must appear on opponent's screen within **500ms** (Supabase Realtime).
*   **Page Load:** Lobby initial load under **1s** (Next.js SSR/ISR).

### Security
*   **RLS Policies:**
    *   `game_sessions`: Public read (for joining). Authenticated create.
    *   `players`: Public read (for lobby display). Authenticated update (only own record).
*   **Validation:** Game code input sanitized. Max 2 players per game enforced at DB level (trigger or constraint) or API level.

### Reliability
*   **Code Collision:** Code generation must handle collisions (retry logic) to ensure uniqueness, though rare with sufficient length.
*   **Disconnection:** If a player disconnects in lobby, status remains (MVP). Enhanced presence (offline detection) is Post-MVP.

### Observability
*   **Logging:** Console logs for development debugging of Realtime events (`[GameSync] Received payload...`).

---

## 4. Dependencies & Integrations

*   **Supabase Client (`@supabase/supabase-js`):** v2.x - Core for DB and Realtime.
*   **Zustand:** v4.x - Local state management.
*   **React Hook Form + Zod:** For validating game code input.
*   **Radix UI / shadcn:** Dialogs, Buttons, Avatars for Lobby UI.
*   **Lucide React:** Icons (User, Check, Clock).

---

## 5. Acceptance Criteria & Traceability

| ID | Acceptance Criteria | Spec Section | Component | Test Idea |
| :--- | :--- | :--- | :--- | :--- |
| **AC2.1.1** | Host can create a game with specific difficulty. | APIs (Create) | `CreateGameForm` | Verify `game_sessions` row has correct `difficulty`. |
| **AC2.1.2** | Unique game code is generated and displayed. | APIs (Create) | `LobbyPage` | Check UI displays code; check DB for code existence. |
| **AC2.2.1** | Guest can join with valid code. | APIs (Join) | `JoinGameForm` | Guest enters code -> redirected to lobby -> 2 players in DB. |
| **AC2.2.2** | Error shown for invalid/full game code. | APIs (Join) | `JoinGameForm` | Enter "INVALID" -> See error toast "Game not found". |
| **AC2.3.1** | Lobby updates instantly when opponent joins. | Detailed Design | `LobbyStore` | Host open in Tab A, Guest joins in Tab B -> Tab A shows Guest avatar. |
| **AC2.3.2** | Player can toggle "Ready" status. | APIs (Set Ready)| `ReadyButton` | Click Ready -> DB updates -> Button disabled/green. |
| **AC2.3.3** | Game starts auto-navigates when both ready. | Workflows | `LobbyPage` | Both click ready -> URL changes to `/game/play/[id]`. |

---

## 6. Risks & Test Strategy

### Risks
*   **Risk:** Race condition if two users join same game simultaneously (exceeding 2 players).
    *   *Mitigation:* DB constraint or atomic transaction for joining.
*   **Risk:** Realtime connection drops.
    *   *Mitigation:* Simple "Reconnecting..." UI indicator if socket closes.

### Test Strategy
*   **Unit:** Test `GameService` logic (mocking Supabase).
*   **Integration:** Test flow: Create -> Join -> Ready -> Redirect.
*   **Manual:** "Split Brain" test: Open two browser windows (Incognito + Normal) to simulate Host/Guest interaction.

