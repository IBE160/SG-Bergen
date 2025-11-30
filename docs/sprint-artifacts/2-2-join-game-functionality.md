# Story 2.2: Join Game Functionality

Status: ready-for-dev

## Story

As a Guest,
I want to join an existing game using a code,
so that I can play with the host.

## Acceptance Criteria

1. **Successful Join:**
   - **Given** a valid game `code` for a session with `status: 'waiting'` and only one player
   - **When** a second authenticated user enters the code and clicks "Join"
   - **Then** a new `players` record is created linking the second user to the game session
   - **And** the user is redirected to the lobby URL (`/game/[code]`)

2. **Invalid Code Error:**
   - **Given** a user attempts to join with an invalid or expired code
   - **When** they submit the join request
   - **Then** the UI displays a clear error message (e.g., "Invalid game code")
   - **And** the user remains on the home/join page

3. **Full Game Error:**
   - **Given** a user attempts to join a game that already has two players
   - **When** they submit the join request
   - **Then** the UI displays a clear error message (e.g., "This game is already full")

## Tasks / Subtasks

- [ ] **Backend: Implement Join API** (AC: 1, 2, 3)
  - [ ] Create `POST /api/game/join` endpoint
  - [ ] Implement validation: Check `code` exists, `status` is 'waiting', and `players` count < 2
  - [ ] Implement player creation: Insert into `players` table (userId, gameId)
  - [ ] Handle race conditions (e.g., check count and insert in transaction or use explicit lock if needed)
  - [ ] Test: Integration tests for `POST /api/game/join` (Valid, Invalid Code, Full Game scenarios)

- [ ] **Frontend: Update Home Page Join Form** (AC: 1, 2, 3)
  - [ ] Add "Join Game" input field and button to `app/(auth)/page.tsx` (or Home page)
  - [ ] Implement `handleJoin` function calling `GameSessionService` or API directly
  - [ ] Display loading state during request
  - [ ] Display error messages (toast or inline) for "Invalid Code" and "Full Game"
  - [ ] Implement redirection to `/game/[code]` on success
  - [ ] Test: Unit test for form state and submission logic

## Dev Notes

### Architecture & Data
- **Endpoint:** `POST /api/game/join` [Source: docs/tech-spec-epic-2.md#APIs-and-Interfaces]
- **Data Model:** `players` table (link `userId` to `gameId`) [Source: docs/tech-spec-epic-2.md#Data-Models-and-Contracts]
- **Service:** `GameSessionService` (in `lib/services/game-session.ts`) should encapsulate the fetch call to the API [Source: docs/tech-spec-epic-2.md#Services-and-Modules]

### Security & Validation
- **Auth:** Endpoint must require authenticated user session (Supabase Auth)
- **RLS:** Ensure `players` table RLS allows `INSERT` for authenticated users (as per Epic 2 Tech Spec)
- **Validation:** Sanitize `code` input (alphanumeric check)

### Race Conditions
- **Risk:** Two players joining simultaneously.
- **Mitigation:** API logic must be atomic. [Source: docs/tech-spec-epic-2.md#Risks-Assumptions-Open-Questions]
  - *Suggestion:* Use a database function or transaction to check count and insert, or rely on a conditional insert if supported easily.

### Project Structure Notes
- **Feature Slice:** `app/game-lobby/` (for Lobby redirect target) and Home page components.
- **Utils:** Use `lib/utils.ts` for any shared validation helpers.

### Learnings from Previous Story
*Note: Previous story file (2.1) was not available for direct analysis, but status is 'done'.*
- **Architecture Alignment:** Ensure `GameSessionService` pattern established in Story 2.1 is followed for the join method.
- **UI Components:** Reuse `Button` and `Input` from `components/ui` (shadcn/ui) used in Story 2.1.

### References
- [Source: docs/tech-spec-epic-2.md] - Epic 2 Technical Specification
- [Source: docs/epics.md] - Epic 2, Story 2.2

## Dev Agent Record

### Context Reference
- [Context: docs/sprint-artifacts/2-2-join-game-functionality.context.xml]

## Story

As a Guest,
I want to join an existing game using a code,
so that I can play with the host.

## Acceptance Criteria

1. **Successful Join:**
   - **Given** a valid game `code` for a session with `status: 'waiting'` and only one player
   - **When** a second authenticated user enters the code and clicks "Join"
   - **Then** a new `players` record is created linking the second user to the game session
   - **And** the user is redirected to the lobby URL (`/game/[code]`)

2. **Invalid Code Error:**
   - **Given** a user attempts to join with an invalid or expired code
   - **When** they submit the join request
   - **Then** the UI displays a clear error message (e.g., "Invalid game code")
   - **And** the user remains on the home/join page

3. **Full Game Error:**
   - **Given** a user attempts to join a game that already has two players
   - **When** they submit the join request
   - **Then** the UI displays a clear error message (e.g., "This game is already full")

## Tasks / Subtasks

- [ ] **Backend: Implement Join API** (AC: 1, 2, 3)
  - [ ] Create `POST /api/game/join` endpoint
  - [ ] Implement validation: Check `code` exists, `status` is 'waiting', and `players` count < 2
  - [ ] Implement player creation: Insert into `players` table (userId, gameId)
  - [ ] Handle race conditions (e.g., check count and insert in transaction or use explicit lock if needed)
  - [ ] Test: Integration tests for `POST /api/game/join` (Valid, Invalid Code, Full Game scenarios)

- [ ] **Frontend: Update Home Page Join Form** (AC: 1, 2, 3)
  - [ ] Add "Join Game" input field and button to `app/(auth)/page.tsx` (or Home page)
  - [ ] Implement `handleJoin` function calling `GameSessionService` or API directly
  - [ ] Display loading state during request
  - [ ] Display error messages (toast or inline) for "Invalid Code" and "Full Game"
  - [ ] Implement redirection to `/game/[code]` on success
  - [ ] Test: Unit test for form state and submission logic

## Dev Notes

### Architecture & Data
- **Endpoint:** `POST /api/game/join` [Source: docs/tech-spec-epic-2.md#APIs-and-Interfaces]
- **Data Model:** `players` table (link `userId` to `gameId`) [Source: docs/tech-spec-epic-2.md#Data-Models-and-Contracts]
- **Service:** `GameSessionService` (in `lib/services/game-session.ts`) should encapsulate the fetch call to the API [Source: docs/tech-spec-epic-2.md#Services-and-Modules]

### Security & Validation
- **Auth:** Endpoint must require authenticated user session (Supabase Auth)
- **RLS:** Ensure `players` table RLS allows `INSERT` for authenticated users (as per Epic 2 Tech Spec)
- **Validation:** Sanitize `code` input (alphanumeric check)

### Race Conditions
- **Risk:** Two players joining simultaneously.
- **Mitigation:** API logic must be atomic. [Source: docs/tech-spec-epic-2.md#Risks-Assumptions-Open-Questions]
  - *Suggestion:* Use a database function or transaction to check count and insert, or rely on a conditional insert if supported easily.

### Project Structure Notes
- **Feature Slice:** `app/game-lobby/` (for Lobby redirect target) and Home page components.
- **Utils:** Use `lib/utils.ts` for any shared validation helpers.

### Learnings from Previous Story
*Note: Previous story file (2.1) was not available for direct analysis, but status is 'done'.*
- **Architecture Alignment:** Ensure `GameSessionService` pattern established in Story 2.1 is followed for the join method.
- **UI Components:** Reuse `Button` and `Input` from `components/ui` (shadcn/ui) used in Story 2.1.

### References
- [Source: docs/tech-spec-epic-2.md] - Epic 2 Technical Specification
- [Source: docs/epics.md] - Epic 2, Story 2.2

## Dev Agent Record

### Context Reference
<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used
Gemini-2.5-Flash

### Debug Log References

### Completion Notes List

### File List
