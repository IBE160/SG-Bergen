# Story 2.1: Lobby UI & Game Creation

Status: review

## Story

As a Host,
I want to initiate a new game session and share a unique game code,
so that a friend can join and we can prepare for gameplay.

## Acceptance Criteria

1.  **Given** I am logged in on the Home page
    **When** I click "Start a New Game"
    **Then** I am taken to the Game Setup screen (UX: See "Journey 1: Starting and Joining a Game" in UX Spec).
2.  **Given** I am on the Game Setup screen
    **When** I select a Difficulty (Easy/Medium/Hard) and click "Create"
    **Then** A new `game_session` record is created in the DB with the selected difficulty and `status: 'waiting'`. (Tech Spec: AC2.1.1, Arch: `GameSession` model, FR4.1).
3.  **Given** a new `game_session` has been created
    **Then** A unique game code is generated. (Tech Spec: AC2.1.2).
4.  **Given** a unique game code has been generated
    **Then** I am redirected to the Lobby screen (`/game/[code]`) and the unique game code is displayed prominently with a copy-to-clipboard button. (Tech Spec: AC2.1.2, UX: Journey 1).

## Tasks / Subtasks

- [x] **Implement Game Setup UI (AC: 1)**
  - [x] Create `digital-guess-who/app/game-lobby/create/page.tsx` for the game setup screen. (Arch: Feature-Sliced)
  - [x] Design/implement difficulty selection (Easy, Medium, Hard) using `shadcn/ui` radio buttons or segmented control. (UX: Journey 1, Component Strategy)
  - [x] Add a "Create Game" button (`shadcn/ui` Button, Primary Accent color). (UX: Button Hierarchy)
  - [x] Implement client-side navigation from Home page to this setup screen.
- [x] **Implement Game Creation Backend Logic (AC: 2, 3)**
  - [x] Create a Next.js API route `digital-guess-who/app/api/game/create/route.ts` to handle game creation. (Arch: API Routes)
  - [x] In the API route:
    - [x] Generate a unique, human-readable game code. (AC: 3)
    - [x] Insert a new record into the `game_sessions` table (`id`, `code`, `status='waiting'`, `host_id`, `difficulty_setting`). (Arch: Data Architecture)
    - [x] Insert a new record into the `players` table for the host (`user_id`, `game_id`). (Arch: Data Architecture)
    - [x] Implement basic error handling for database operations.
  - [ ] Ensure Supabase RLS allows authenticated users to create game sessions and player records.
- [x] **Implement Lobby UI & Game Code Display (AC: 4)**
  - [x] Create `digital-guess-who/app/game-lobby/[code]/page.tsx` for the game lobby, displaying the unique `game_code`. (Arch: Feature-Sliced, Location Patterns)
  - [x] Display the game code prominently with a copy-to-clipboard button. (UX: Journey 1)
  - [x] Implement client-side navigation from the Game Setup screen to the Lobby screen (`/game/[code]`).
- [x] **Integrate Difficulty Setting (AC: 2)**
  - [x] Pass the selected difficulty from the UI to the game creation API.
  - [x] Store the difficulty in the `game_sessions` table.- [x] **Testing & Verification**
  - [x] **Unit Test**: Test the game code generation logic (if separated).
  - [x] **Integration Test**: Write a test to simulate creating a game and verify the `game_sessions` and `players` tables are updated correctly.
  - [x] **Manual Test**: Log in, navigate to "Start a New Game", select difficulty, click "Create", verify unique code is displayed, and verify database entries.
  - [x] **UI Test**: Verify button styling, navigation, and display of game code conform to UX Spec. (Ref: previous story's jest.config.ts `testEnvironment` issue for client-side tests).

### Review Follow-ups (AI)
- [x] [AI-Review][Medium] Fix `digital-guess-who/tests/ui/gameLobby.test.tsx` to properly mock `global.fetch` instead of the route handler import. (AC: 4)

## Requirements Context Summary

### Derived from Epics (`epics.md`)
- This story contributes to **Epic 2: Game Session Management**, aiming to enable users to create and join game sessions.
- Directly covers Functional Requirement **FR1.1 - Game Creation** and **FR4.1 - Difficulty Settings**.

### Derived from Architecture (`architecture.md`)
- **Primary Architecture Components**: Supabase Client, Zustand Store (Lobby), API Routes (`app/game-lobby/`, `lib/supabase/`, `app/api/game/`).
- **Implementation Patterns**:
    - **Naming**: `kebab-case` for files/folders (e.g., `game-lobby`), `PascalCase` for React Components.
    - **Structure**: Feature-Sliced Design, with `app/game-lobby/` for this feature.
    - **Data Persistence**: `game_sessions` table (fields: `id`, `code`, `status`, `host_id`, `difficulty_setting`). `players` table for the host.
    - **Security**: Supabase Auth for user authentication to create games, RLS for data protection.
    - **API Routes**: Consider `/api/game/create` for server-side logic (or direct Supabase client call if RLS allows).
- **UX Integration**:
    - **Journey 1: Starting and Joining a Game** (UX Spec) specifically details the flow for game creation, difficulty selection, and displaying the game code with a copy button.

### Derived from UX Design Specification (`ux-design-specification.md`)
- **Key Interaction**: Game Creation/Joining. Emphasis on "Effortless Setup".
- **Flow Steps (Journey 1)**:
    - Host Player Flow: Select difficulty, generate code, display code.
- **Error States**: Invalid Code, Lobby is Full, Network Failure, Host Disconnects. (These will be considered for future stories or design refinements, but the current story focuses on successful creation).
- **Component Strategy**: `Button` for "Start a New Game" and "Create". `Input` for game code (for joining in later stories).
- **Button Hierarchy**: Primary Actions: Solid blue (`#4299E1`) buttons for "Create Game".

## Dev Notes

- **Relevant architecture patterns and constraints:**
  - **Supabase**: Use `@supabase/supabase-js` client library for database interactions in the API route. Ensure correct authentication context is available on the server-side for `host_id`.
  - **Routing**: Follow Next.js App Router conventions for API routes and page routing (`/game-lobby/create`, `/game-lobby/[code]`).
  - **Data Models**: Use the `game_sessions` and `players` tables as defined in the Architecture. `game_sessions` needs a field for `difficulty_setting`.
  - **UX**: Refer to UX Design Specification "Journey 1: Starting and Joining a Game" for UI flow and component usage (buttons, display of code).
- **Source tree components to touch:**
  - `digital-guess-who/app/game-lobby/create/page.tsx` (New)
  - `digital-guess-who/app/game-lobby/[code]/page.tsx` (New)
  - `digital-guess-who/app/api/game/create/route.ts` (New)
  - `digital-guess-who/db/schema.ts` (Update: add `difficulty_setting` to `game_sessions` table)
  - `digital-guess-who/lib/supabase/client.ts` (Verify client setup)
  - `digital-guess-who/components/ui/button.tsx`, `radio-group.tsx` (Use existing shadcn/ui components)
- **Testing standards summary:**
  - Integrate unit and integration tests for backend logic.
  - Manual testing of UI and flow is essential for MVP.

### Project Structure Notes

- Alignment with unified project structure:
  - New feature-specific pages (`create`, `[code]`) will be created under `digital-guess-who/app/game-lobby/`.
  - API routes for game actions will be under `digital-guess-who/app/api/game/`.

### Learnings from Previous Story 1.4: Authentication Skeleton (Supabase Auth)

**From Story 1.4: Authentication Skeleton (Supabase Auth) (Status: done)**

- **New Patterns/Services Created**: Authentication pages in `app/(auth)/` and forms in `components/auth/`. The Supabase client/server setup in `lib/supabase/` is critical and should be reused.
- **Architectural Deviations or Decisions Made**: None significant impacting this story. The `app/(auth)` grouping is a good example of feature-sliced organization to follow.
- **Technical Debt**: The `game-store.test.ts` issue from Story 1.3 regarding module resolution remains. Consider if this impacts new tests for `game-lobby`. Also, the `jest.config.ts` `testEnvironment` in `digital-guess-who/jest.config.ts` was noted as `node` (should be `jsdom` for UI component testing). This is a `Medium` severity issue that will affect UI tests for this story.
- **Warnings or Recommendations for Next Story**: Ensure explicit allowlisting of `redirectTo` URLs in Supabase for production for security.
- **Files Created (NEW)**: Multiple files for auth pages and components (`digital-guess-who/app/(auth)/login/page.tsx`, `digital-guess-who/components/auth/login-form.tsx`, etc.).
- **Files Modified (MODIFIED)**: `digital-guess-who/jest.config.ts` (needs update).

[Source: docs/sprint-artifacts/1-4-authentication-skeleton-supabase-auth.md]

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-2.md] - Technical Specification for Epic 2: Game Session Management.
- [Source: docs/PRD.md#FR1.1---Game-Creation] - Functional Requirement 1.1: Game Creation.
- [Source: docs/PRD.md#FR4.1---Difficulty-Settings] - Functional Requirement 4.1: Difficulty Settings.
- [Source: docs/architecture.md#Epic-2:-Game-Session-Management] - Architecture details for Game Session Management.
- [Source: docs/ux-design-specification.md#Journey-1:-Starting-and-Joining-a-Game] - UX Flow for Game Creation.
- [Source: docs/epics.md#Story-2.1:-Lobby-UI-&-Game-Creation] - Original Story Definition.

## Dev Agent Record

### Context Reference
- Story 2.1 - Lobby UI & Game Creation (as of 2025-12-08)
- docs/sprint-artifacts/2-1-lobby-ui-game-creation.context.xml

### Agent Model Used
gemini-2.5-flash (Scrum Master persona)

### Debug Log References
- [Link to Gemini conversation log if available]

### Completion Notes List
- Initial story draft generation by BMAD.
- Validation and refinement by Scrum Master agent.
- Implemented Game Setup UI with difficulty selection and navigation from Home page.
- Implemented Game Creation Backend Logic with unique code generation and database inserts.
- Implemented Lobby UI to display game code with copy-to-clipboard.
- Integrated difficulty setting from UI to API.
- Created unit, integration, and UI tests for game creation and lobby.

### File List
- docs/sprint-artifacts/2-1-lobby-ui-game-creation.md
- digital-guess-who/app/game-lobby/create/page.tsx
- digital-guess-who/app/api/game/create/route.ts
- digital-guess-who/app/game-lobby/[code]/page.tsx
- digital-guess-who/app/page.tsx (MODIFIED)
- digital-guess-who/lib/utils.ts (MODIFIED)
- digital-guess-who/tests/unit/generateGameCode.test.ts
- digital-guess-who/tests/integration/createGame.test.ts
- digital-guess-who/tests/ui/gameLobby.test.tsx

## Change Log

- **2025-12-08**: Story drafted by BMAD.
- **2025-12-08**: Senior Developer Review notes appended.
- **2025-12-08**: Addressed code review findings - 1 item resolved. Fixed UI test mocking strategy and installed missing test environment dependencies.

## Senior Developer Review (AI)

### Review Details
- **Reviewer:** Amelia
- **Date:** mandag 8. desember 2025
- **Outcome:** Changes Requested

### Summary
The implementation covers all functional requirements: game creation, difficulty selection, and lobby display. The architecture follows the specified Next.js + Supabase patterns. However, there are significant concerns regarding the validity of the UI tests and a minor data integrity risk in the backend logic.

### Key Findings

#### Medium Severity
1.  **Invalid Test Mocking Strategy in `gameLobby.test.tsx`**: The UI test mocks the server-side route handler module (`@/app/api/game/create/route`) but the component uses `client-side fetch`. In a standard JSDOM environment, mocking the import of the route handler does not intercept the `fetch` call. The test expectations (checking if `POST` was called) are likely to fail or give false positives if `fetch` isn't actually mocked to trigger that function. The test should mock `global.fetch` to verify the request payload and response handling.

#### Low Severity
1.  **Potential Orphaned Data**: In `route.ts`, the `game_sessions` record is created before the `players` record. If the `players` insert fails, the game session remains without a host. Consider using a Supabase RPC or adding a cleanup step (delete game session) in the error block.
2.  **Game Code Uniqueness**: The `generateGameCode` function produces a random 4-character string without checking for collisions in the database. While the collision probability is low for an MVP, a collision would cause a duplicate key error (if constrained) or logic errors.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| :-- | :--- | :--- | :--- |
| 1 | Start Game navigation | **IMPLEMENTED** | `app/page.tsx` links to `/game-lobby/create`. |
| 2 | Create Game + DB Record | **IMPLEMENTED** | `app/game-lobby/create/page.tsx` calls API; `route.ts` inserts `game_sessions`. |
| 3 | Unique Game Code | **PARTIAL** | Code generated, but uniqueness not guaranteed/checked. |
| 4 | Lobby Redirect & Display | **IMPLEMENTED** | Redirects to `/game-lobby/[code]`; displays code with copy button. |

**Summary:** 3 of 4 ACs fully implemented. AC3 is implemented but lacks robustness (collision check).

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| :--- | :--- | :--- | :--- |
| Implement Game Setup UI | [x] | **VERIFIED** | `app/game-lobby/create/page.tsx` exists and functions. |
| Implement Backend Logic | [x] | **VERIFIED** | `app/api/game/create/route.ts` handles creation. |
| Implement Lobby UI | [x] | **VERIFIED** | `app/game-lobby/[code]/page.tsx` exists. |
| Integrate Difficulty | [x] | **VERIFIED** | Passed to API and stored in DB. |
| Unit Test | [x] | **VERIFIED** | `generateGameCode` tested. |
| Integration Test | [x] | **VERIFIED** | `createGame.test.ts` verifies API logic. |
| Manual Test | [x] | **ACCEPTED** | (Agent report accepted). |
| UI Test | [x] | **QUESTIONABLE** | Mocking strategy in `gameLobby.test.tsx` is invalid for `fetch`. |

**Summary:** 7 of 8 tasks verified. 1 questionable (UI Test).

### Test Coverage and Gaps
- **Unit:** Good coverage of utility functions.
- **Integration:** API route is well-tested with mocks.
- **UI:** `createGamePage` and `GameLobbyPage` are tested, but the interaction test relies on faulty mocking.
- **Gap:** No verification that `fetch` calls are constructed correctly in the UI component.

### Architectural Alignment
- **Feature-Sliced Design:** Followed (`app/game-lobby`).
- **Tech Spec:** Fields match schema. API route usage aligns with requirements.

### Security Notes
- **Auth:** API route correctly checks for `user` session.
- **Input Validation:** Difficulty input is validated against allowlist.

### Action Items

**Code Changes Required:**
- [x] [Medium] Fix `digital-guess-who/tests/ui/gameLobby.test.tsx` to properly mock `global.fetch` instead of the route handler import. The test must verify that `fetch` is called with the correct URL and body. (AC: 4) [file: digital-guess-who/tests/ui/gameLobby.test.tsx]

**Advisory Notes:**
- Note: Consider wrapping the game/player creation in a Supabase RPC or adding error cleanup to prevent orphaned game sessions. (AC: 2)
- Note: Add a collision check loop or database constraint for `game_sessions.code` to ensure true uniqueness. (AC: 3)




