# Story 2.2: Join Game Functionality

Status: drafted

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

- [ ] **Implement Join Game Backend Logic (AC: 1, 2, 3)**
  - [ ] Create a Next.js API route `digital-guess-who/app/api/game/join/route.ts`.
  - [ ] In the API route:
    - [ ] Validate request body contains `code`.
    - [ ] Query `game_sessions` by `code` to find `id` and check `status` is 'waiting'.
    - [ ] Count existing `players` for this game. If >= 2, return 409 Conflict ("Game is full").
    - [ ] If valid, insert new record into `players` (`user_id`, `game_id`, `is_ready=false`).
    - [ ] Return `{ gameId, playerId }` on success.
- [ ] **Implement Join Game UI (AC: 1, 4, 5)**
  - [ ] Update `digital-guess-who/app/page.tsx` (Home Page) to include a "Join Game" section.
  - [ ] Add an Input field for "Game Code" and a "Join" button (`shadcn/ui` components).
  - [ ] Implement client-side logic to call `/api/game/join`.
  - [ ] Handle success: Redirect to `/game-lobby/[code]` (reuse existing lobby page from Story 2.1).
  - [ ] Handle error: Display toast notification (`shadcn/ui` toast) with error message.
- [ ] **Testing & Verification**
  - [ ] **Unit Test**: Test the validation logic in the API route (mocking DB).
  - [ ] **Integration Test**: Simulate a Host creating a game, then a Guest joining it. Verify DB state (2 players).
  - [ ] **UI Test**: Test the Home page interaction (entering code, clicking join, mocking API response). **Critical**: Ensure `global.fetch` is properly mocked per learnings from Story 2.1.
  - [ ] **Manual Test**: Open two browsers/incognito. Host creates game. Guest enters code. Verify Guest enters lobby. Verify error when entering invalid code.

## Dev Notes

- **Relevant architecture patterns and constraints:**
  - **API**: Use `/api/game/join` for encapsulation.
  - **Concurrency**: There is a small race condition risk if two guests join simultaneously. For MVP, a simple check-then-insert is acceptable. If `players` table has a constraint or trigger, that's better, but application-level check is sufficient for now.
  - **Security**: Ensure `user_id` is obtained from the authenticated session (Supabase Auth).
  - **Reusability**: The Lobby Page (`/game-lobby/[code]`) already exists (Story 2.1). We are just routing the Guest to it.
- **Source tree components to touch:**
  - `digital-guess-who/app/api/game/join/route.ts` (New)
  - `digital-guess-who/app/page.tsx` (Update)
  - `digital-guess-who/components/home/join-game-form.tsx` (New - recommended to extract form)
- **Testing standards summary:**
  - Fix: In `digital-guess-who/tests/ui/home.test.tsx` (or new file), ensure `global.fetch` is mocked correctly to intercept the API call, fixing the issue seen in Story 2.1.

### Project Structure Notes

- Alignment with unified project structure:
  - Join logic resides in `api/game/join`.
  - UI components for joining can live in `app/page.tsx` or a dedicated `components/game/join-form.tsx`.

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#APIs-&-Interfaces] - API definition for Join Game.
- [Source: docs/epics.md#Story-2.2:-Join-Game-Functionality] - Original Story Definition.
- [Source: docs/sprint-artifacts/2-1-lobby-ui-game-creation.md] - Previous Story (Lobby UI).

## Dev Agent Record

### Context Reference
<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used
gemini-2.5-flash

### Debug Log References

### Completion Notes List

### File List

