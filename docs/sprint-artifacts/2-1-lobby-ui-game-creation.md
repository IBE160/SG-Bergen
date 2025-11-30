# Story 2.1: Lobby UI & Game Creation

Status: ready-for-dev

## Story

As a Host,
I want to create a new game and receive a unique code,
So that I can invite a friend to play.

## Acceptance Criteria

1.  **Given** I am logged in on the Home page, **when** I click "Start a New Game", **then** I am taken to the Game Setup screen.
2.  **When** I select a Difficulty (Easy/Medium/Hard) and click "Create", **then** a new `game_session` record is created in the DB with `status: 'waiting'`.
3.  **And** I am redirected to the Lobby screen (`/game/[code]`).
4.  **And** the unique game code is displayed prominently with a copy button.

## Tasks / Subtasks

- [ ] Task 1: Create Game Setup UI (AC: 1)
  - [ ] Create page `app/game-lobby/page.tsx`.
  - [ ] Add UI for selecting difficulty (Easy, Medium, Hard) and a "Create" button.
- [ ] Task 2: Implement Game Creation Logic (AC: 2)
  - [ ] Create an API route `app/api/game/create/route.ts`.
  - [ ] The API will generate a unique code and create a `game_sessions` record in the database.
  - [ ] It will also create a `players` record for the host user.
- [ ] Task 3: Implement Redirection and Lobby UI (AC: 3, 4)
  - [ ] On successful creation, redirect the user to `/game/[code]`.
  - [ ] The lobby page should display the game code prominently.
  - [ ] Add a button to copy the game code to the clipboard.

## Dev Notes

- **Architecture:** The implementation must align with the `tech-spec-epic-2.md`. A dedicated Zustand store (`LobbyStore`) should be created to manage the lobby's client-side state.
- **Real-time:** The lobby page must subscribe to a Supabase Realtime channel named `game-[gameId]`.
- **Data Models:** Use the `game_sessions` and `players` table schemas as defined in `tech-spec-epic-2.md`.
- **Styling:** Components should adhere to the visual foundation in the `ux-design-specification.md`, using `shadcn/ui` components.

### Project Structure Notes

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

### File List
