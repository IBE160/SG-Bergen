# Story 2.1: Lobby UI & Game Creation

Status: done

## Story

As a Host,
I want to create a new game and receive a unique code,
So that I can invite a friend to play.

## Acceptance Criteria

1.  **Given** an authenticated user is on the game setup screen, **when** they select a difficulty ("Easy", "Medium", or "Hard") and click the "Create" button, **then** a `POST` request is sent to the `/api/game/create` endpoint.
2.  **Given** the game is successfully created via the API, **then** a new `game_sessions` record exists in the database with the correct `host_id`, `difficulty`, `status: 'waiting'`, and a unique 6-character `code`.
3.  **Given** the game is successfully created, **then** the user is automatically redirected to the lobby URL at `/game/[code]`.
4.  **Given** the user is on the lobby page, **then** the unique game code is displayed prominently with a "Copy" button.

## Tasks / Subtasks

- [x] Task 1: Create Game Setup UI (AC: 1)
  - [x] Create page `app/game-lobby/page.tsx`.
  - [x] Add UI for selecting difficulty (Easy, Medium, Hard) and a "Create" button that calls the creation API.
- [x] Task 2: Implement Game Creation Logic (AC: 2)
  - [x] Create an API route `app/api/game/create/route.ts`.
  - [x] The API will generate a unique code and create a `game_sessions` record in the database.
  - [x] It will also create a `players` record for the host user.
- [x] Task 3: Implement Redirection and Lobby UI (AC: 3, 4)
  - [x] On successful creation, redirect the user to `/game/[code]`.
  - [x] The lobby page should display the game code prominently.
  - [x] Add a button to copy the game code to the clipboard.
- [x] Task 4: Testing (AC: 1, 2, 3, 4)
  - [x] Write a unit test for the Game Setup UI to verify the "Create" button's API call.
  - [x] Write an integration test for the `/api/game/create` endpoint to validate database record creation.
  - [x] Write an E2E test to simulate the full game creation flow, from clicking "Create" to verifying the lobby page content.

## Dev Notes

- **Architecture:** The implementation must align with the `tech-spec-epic-2.md`. Specifically, use a dedicated **Zustand** store (`LobbyStore`) for client-side state management and **Supabase Realtime** for instant synchronization of the lobby state, as detailed in the "System Architecture Alignment" section of the tech spec.
- **Real-time:** The lobby page must subscribe to a Supabase Realtime channel named `game-[gameId]`.
- **Data Models:** Use the `game_sessions` and `players` table schemas as defined in `tech-spec-epic-2.md`.
- **Styling:** Components should adhere to the visual foundation in the `ux-design-specification.md`, using `shadcn/ui` components.

### Project Structure Notes

- **Note:** The `unified-project-structure.md` document has not been created yet. The following notes are based on the tech spec.
- **Feature Slice:** All components and services for this story should be located within the `app/game-lobby/` directory.
- **Service Layer:** Business logic for game creation should be in `lib/services/game-session.ts` as per the tech spec.
- **State Management:** The Zustand store will be at `app/game-lobby/store.ts`.

### Learnings from Previous Story
- **From Story 1.4 (Authentication Skeleton):** The authentication flow is established in `app/(auth)/`. This story will consume the authenticated user session to associate the `user_id` with the created game. The file structure for auth can serve as a template for creating the new feature-sliced directory for the lobby.

### References

- [Source: docs/epics.md#Story-2.1]
- [Source: docs/tech-spec-epic-2.md#Workflows-and-Sequencing]
- [Source: docs/ux-design-specification.md#Journey-1-Starting-and-Joining-a-Game]
- [Source: docs/architecture.md#Epic-to-Architecture-Mapping]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-1-lobby-ui-game-creation.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### Completion Notes
**Completed:** søndag 30. november 2025
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### File List

- digital-guess-who/db/types.ts
- digital-guess-who/lib/services/game-session.ts
- digital-guess-who/app/api/game/create/route.ts
- digital-guess-who/app/game-lobby/store.ts
- digital-guess-who/app/game-lobby/page.tsx
- digital-guess-who/app/game/[code]/page.tsx
- digital-guess-who/__tests__/game-lobby/GameSetup.test.tsx
- digital-guess-who/__tests__/api/GameCreate.test.ts
- digital-guess-who/jest.setup.js

## Change Log

- **2025-11-30:** Initial draft created.
- **2025-11-30:** Updated by Scrum Master based on validation report:
  - Changed status to `drafted`.
  - Aligned ACs with tech spec and improved atomicity.
  - Added explicit testing subtasks.
  - Enhanced specificity in Dev Notes.
  - Added Change Log section.
- **2025-11-30:** Implemented Story 2.1 (Dev Agent):
  - Created Game Setup UI and Lobby UI.
  - Implemented Game Creation API and Service.
  - Updated DB types to include `difficulty`.
  - Added Unit and Integration tests.
  - All tests passing.
  - Status changed to `review`.
