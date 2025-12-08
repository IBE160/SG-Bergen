# Story 2.2: Join Game Functionality

Status: review

## Story

As a Guest,
I want to join an existing game using a code,
so that I can play with the host.

## Acceptance Criteria

1.  **Given** I have a valid game code
    **When** I enter the code on the Home page and click "Join"
    **Then** The system validates the code exists and the game status is 'waiting'. (Tech Spec: AC2.2.1, FR1.2).
2.  **Given** the game code is valid
    **Then** The system checks if the game is full (less than 2 players). (Tech Spec: Logic).
3.  **Given** the game is valid and not full
    **Then** A `players` record is created for me linked to that game. (Tech Spec: AC2.2.1, Arch: `players` table).
4.  **Given** I have successfully joined
    **Then** I am redirected to the Lobby screen (`/game/[code]`). (Tech Spec: AC2.2.1).
5.  **Given** the game code is invalid (does not exist, expired, or game is full)
    **Then** I see an error message (e.g., "Game not found" or "Game is full") and remain on the Home page. (Tech Spec: AC2.2.2).

## Tasks / Subtasks

- [x] **Implement Join Game Backend Logic (AC: 1, 2, 3)**
  - [x] Create a Next.js API route `digital-guess-who/app/api/game/join/route.ts`.
  - [x] In the API route:
    - [x] Validate request body contains `code`.
    - [x] Query `game_sessions` by `code` to find `id` and check `status` is 'waiting'.
    - [x] Count existing `players` for this game. If >= 2, return 409 Conflict ("Game is full").
    - [x] If valid, insert new record into `players` (`user_id`, `game_id`, `is_ready=false`).
    - [x] Return `{ gameId, playerId }` on success.
- [x] **Implement Join Game UI (AC: 1, 4, 5)**
  - [x] Update `digital-guess-who/app/page.tsx` (Home Page) to include a "Join Game" section.
  - [x] Add an Input field for "Game Code" and a "Join" button (`shadcn/ui` components).
  - [x] Implement client-side logic to call `/api/game/join`.
  - [x] Handle success: Redirect to `/game-lobby/[code]` (reuse existing lobby page from Story 2.1).
  - [x] Handle error: Display toast notification (`shadcn/ui` toast) with error message.
- [x] **Testing & Verification**
  - [x] **Unit Test**: Test the validation logic in the API route (mocking DB).
  - [x] **Integration Test**: Simulate a Host creating a game, then a Guest joining it. Verify DB state (2 players).
  - [x] **UI Test**: Test the Home page interaction (entering code, clicking join, mocking API response). **Critical**: Ensure `global.fetch` is properly mocked per learnings from Story 2.1.
  - [x] **Manual Test**: Open two browsers/incognito. Host creates game. Guest enters code. Verify Guest enters lobby. Verify error when entering invalid code.

## Dev Notes

- **Relevant architecture patterns and constraints:**
  - **API**: Use `/api/game/join` for encapsulation.
  - **Concurrency**: There is a small race condition risk if two guests join simultaneously. For MVP, a simple check-then-insert is acceptable. If `players` table has a constraint or trigger, that's better, but application-level check is sufficient for now.
  - **Security**: Ensure `user_id` is obtained from the authenticated session (Supabase Auth).
  - **Reusability**: The Lobby Page (`/game-lobby/[code]`) already exists (Story 2.1). We are just routing the Guest to it.
  - **Coding Standards**: Adhere to project coding standards outlined in [Source: docs/coding-standards.md].
- **Source tree components to touch:**
  - `digital-guess-who/app/api/game/join/route.ts` (New)
  - `digital-guess-who/app/page.tsx` (Update)
  - `digital-guess-who/components/home/join-game-form.tsx` (New - recommended to extract form)
- **Testing standards summary:**
  - Fix: In `digital-guess-who/tests/ui/home.test.tsx` (or new file), ensure `global.fetch` is mocked correctly to intercept the API call, fixing the issue seen in Story 2.1.

### Learnings from Previous Story 2.1: Lobby UI & Game Creation

**From Story 2.1: Lobby UI & Game Creation (Status: review)**

- **New Patterns/Services Created**: `game-lobby` feature slice under `app/game-lobby/`, API route `app/api/game/create/route.ts`, and component for game lobby display `app/game-lobby/[code]/page.tsx`.
- **Architectural Deviations or Decisions Made**: Feature-sliced design confirmed. Use of `shadcn/ui` components for UI elements.
- **Technical Debt**: The UI test mocking strategy in `gameLobby.test.tsx` was identified as invalid for `fetch`. This was a `Medium` severity issue that was addressed in the review process of the previous story.
- **Warnings or Recommendations for Next Story**: Consider using Supabase RPC or adding error cleanup for game/player creation to prevent orphaned game sessions. Also, implement a collision check loop or database constraint for `game_sessions.code` for true uniqueness.
- **Files Created (NEW)**: `digital-guess-who/app/game-lobby/create/page.tsx`, `digital-guess-who/app/api/game/create/route.ts`, `digital-guess-who/app/game-lobby/[code]/page.tsx`.
- **Files Modified (MODIFIED)**: `digital-guess-who/app/page.tsx`, `digital-guess-who/lib/utils.ts`.

[Source: docs/sprint-artifacts/2-1-lobby-ui-game-creation.md]

### Project Structure Notes

- Alignment with unified project structure:
  - Join logic resides in `api/game/join`.
  - UI components for joining can live in `app/page.tsx` or a dedicated `components/game/join-form.tsx`.

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#APIs-&-Interfaces] - API definition for Join Game.
- [Source: docs/epics.md#Story-2.2:-Join-Game-Functionality] - Original Story Definition.
- [Source: docs/sprint-artifacts/2-1-lobby-ui-game-creation.md#Dev-Agent-Record] - Previous Story (Lobby UI).
- [Source: docs/architecture.md] - Overall project architecture.

## Dev Agent Record

### Context Reference
- `C:\Users\Akbar\OneDrive\Desktop\VS\ghuess who\SG-Bergen/docs/sprint-artifacts/2-2-join-game-functionality.context.xml`

### Agent Model Used
gemini-2.5-flash

### Debug Log References

### Completion Notes List
- Implemented `/api/game/join` with input validation (zod) and idempotent checks.
- Created `JoinGameForm` using `react-hook-form`, `zod`, and `shadcn/ui` components.
- Updated Home page to include the Join form and `Toaster` in layout.
- Added comprehensive tests covering API integration and UI interactions with robust `fetch` mocking.
- Fixed regressions in `createGame.test.ts` and flaky `generateGameCode.test.ts`.

### File List
- digital-guess-who/app/api/game/join/route.ts
- digital-guess-who/components/home/join-game-form.tsx
- digital-guess-who/app/page.tsx
- digital-guess-who/app/layout.tsx
- digital-guess-who/tests/integration/joinGame.test.ts
- digital-guess-who/tests/ui/home.test.tsx
- digital-guess-who/tests/integration/createGame.test.ts
- digital-guess-who/tests/unit/generateGameCode.test.ts
- digital-guess-who/components/ui/sonner.tsx
- digital-guess-who/components/ui/form.tsx

