# Story 2.1: Lobby UI & Game Creation

Status: drafted

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

- [ ] **Implement Game Setup UI (AC: 1)**
  - [ ] Create `digital-guess-who/app/game-lobby/create/page.tsx` for the game setup screen. (Arch: Feature-Sliced)
  - [ ] Design/implement difficulty selection (Easy, Medium, Hard) using `shadcn/ui` radio buttons or segmented control. (UX: Journey 1, Component Strategy)
  - [ ] Add a "Create Game" button (`shadcn/ui` Button, Primary Accent color). (UX: Button Hierarchy)
  - [ ] Implement client-side navigation from Home page to this setup screen.
- [ ] **Implement Game Creation Backend Logic (AC: 2, 3)**
  - [ ] Create a Next.js API route `digital-guess-who/app/api/game/create/route.ts` to handle game creation. (Arch: API Routes)
  - [ ] In the API route:
    - [ ] Generate a unique, human-readable game code. (AC: 3)
    - [ ] Insert a new record into the `game_sessions` table (`id`, `code`, `status='waiting'`, `host_id`, `difficulty_setting`). (Arch: Data Architecture)
    - [ ] Insert a new record into the `players` table for the host (`user_id`, `game_id`). (Arch: Data Architecture)
    - [ ] Implement basic error handling for database operations.
  - [ ] Ensure Supabase RLS allows authenticated users to create game sessions and player records.
- [ ] **Implement Lobby UI & Game Code Display (AC: 4)**
  - [ ] Create `digital-guess-who/app/game-lobby/[code]/page.tsx` for the game lobby, displaying the unique `game_code`. (Arch: Feature-Sliced, Location Patterns)
  - [ ] Display the game code prominently with a copy-to-clipboard button. (UX: Journey 1)
  - [ ] Implement client-side navigation from the Game Setup screen to the Lobby screen (`/game/[code]`).
- [ ] **Integrate Difficulty Setting (AC: 2)**
  - [ ] Pass the selected difficulty from the UI to the game creation API.
  - [ ] Store the difficulty in the `game_sessions` table.
- [ ] **Testing & Verification**
  - [ ] **Unit Test**: Test the game code generation logic (if separated).
  - [ ] **Integration Test**: Write a test to simulate creating a game and verify the `game_sessions` and `players` tables are updated correctly.
  - [ ] **Manual Test**: Log in, navigate to "Start a New Game", select difficulty, click "Create", verify unique code is displayed, and verify database entries.
  - [ ] **UI Test**: Verify button styling, navigation, and display of game code conform to UX Spec. (Ref: previous story's jest.config.ts `testEnvironment` issue for client-side tests).

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

### Agent Model Used
gemini-2.5-flash (Scrum Master persona)

### Debug Log References
- [Link to Gemini conversation log if available]

### Completion Notes List
- Initial story draft generation by BMAD.
- Validation and refinement by Scrum Master agent.

### File List
- docs/sprint-artifacts/2-1-lobby-ui-game-creation.md

## Change Log

- **2025-12-08**: Story drafted by BMAD.




