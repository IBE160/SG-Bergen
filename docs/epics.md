# ibe160 - Epic Breakdown

**Author:** BIP
**Date:** lørdag 29. november 2025
**Project Level:** MVP (School Project)
**Target Scale:** Small (2-player sessions)

---

## Overview

This document provides the complete epic and story breakdown for ibe160, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It incorporates context from the UX Design Specification and Architecture Plan.

---

## Epics Summary

**Epic 1: Project Foundation**
*Goal:* Establish the core technical infrastructure, development environment, and deployment pipeline to enable feature development.
*Scope:* Project scaffolding (Next.js + Supabase), tailored UI library setup (shadcn/ui + Tailwind), database schema initialization, and deployment to Vercel.

**Epic 2: Game Session Management**
*Goal:* Enable users to create and join game sessions, ensuring two players can successfully connect and prepare to play.
*Scope:* Game creation (generating codes), lobby system, game joining logic, player readiness state, and difficulty selection (Easy/Medium/Hard).
*FR Coverage:* FR1.1, FR1.2, FR1.3, FR4.1

**Epic 3: Core Gameplay Loop [COMPLETED]**
*Goal:* Implement the complete turn-based game experience, allowing players to select characters, ask questions, eliminate options, and determine a winner.
*Scope:* Character selection, turn management (real-time sync), questioning interface, character elimination interactions, guessing mechanics, and win/loss logic.
*FR Coverage:* FR2.1, FR2.2, FR3.1, FR3.2, FR3.3, FR3.4

**Epic 4: Post-Game Experience**
*Goal:* Provide a polished conclusion to the game session and allow players to easily re-engage.
*Scope:* Win/Loss screens, "Play Again" functionality, and navigation back to the main menu.
*FR Coverage:* FR4.2

---

## Functional Requirements Inventory

*   **FR1.1 - Game Creation:** The system shall allow a user to create a new game session, generating a unique game code.
*   **FR1.2 - Game Joining:** The system shall allow a user to join an existing game session by entering a valid game code.
*   **FR1.3 - Player Readiness:** The system shall allow both players to confirm their readiness before starting a game.
*   **FR2.1 - Secret Character Selection:** The system shall allow each player to secretly select one character from the available grid.
*   **FR2.2 - Base Character Pool:** The system shall provide a default pool of at least 50 characters for selection.
*   **FR3.1 - Turn-Based Play:** The system shall enforce turn-based gameplay, alternating between players.
*   **FR3.2 - Questioning & Answering:** The system shall allow the active player to ask a yes/no question and the non-active player to provide a "Yes" or "No" answer.
*   **FR3.3 - Character Elimination:** The system shall allow the active player to visually eliminate characters from their board based on the opponent's answer.
*   **FR3.4 - Guessing & Win/Loss Condition:** The system shall allow the active player to make a guess about the opponent's secret character and determine the winner/loser.
*   **FR4.1 - Difficulty Settings:** The system shall allow players to select game difficulty (Easy, Medium, Hard) which adjusts the number of characters.
*   **FR4.2 - Post-Game Options:** The system shall provide options to "Play Again" or "Return to Main Menu" after a game concludes.

---

## FR Coverage Map

*   **Epic 1 (Foundation):** Infrastructure support for All FRs
*   **Epic 2 (Session Management):** FR1.1, FR1.2, FR1.3, FR4.1
*   **Epic 3 (Core Gameplay):** FR2.1, FR2.2, FR3.1, FR3.2, FR3.3, FR3.4
*   **Epic 4 (Post-Game):** FR4.2

---

## Epic 1: Project Foundation

**Goal:** Establish the core technical infrastructure, development environment, and deployment pipeline to enable feature development.

### Story 1.1: Project Scaffolding & Vercel Deployment

As a developer,
I want to initialize the Next.js + Supabase project and deploy it to Vercel,
So that we have a live URL and a production-ready environment from day one.

**Acceptance Criteria:**

**Given** I have the necessary Vercel and Supabase credentials
**When** I run the initialization command `npx create-next-app -e with-supabase`
**Then** A new Next.js 15+ (App Router) project is created with TypeScript
**And** The project is connected to a Vercel project
**And** A successful build is deployed to a production URL (e.g., `digital-guess-who.vercel.app`)
**And** The repository is pushed to GitHub

**Prerequisites:** None

**Technical Notes:**
- Use the `with-supabase` starter template as defined in Architecture.
- Ensure `.env.local` is correctly configured with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Configure Vercel environment variables.

### Story 1.2: Database Schema & Type Generation

As a developer,
I want to define the initial Supabase database schema and generate TypeScript types,
So that we can interact with the database using type-safe methods.

**Acceptance Criteria:**

**Given** The Supabase project is active
**When** I run the SQL migration script defined in Architecture
**Then** Tables for `users`, `game_sessions`, `players`, and `moves` are created in the public schema
**And** I can run `supabase gen types typescript` to generate `database.types.ts`
**And** The generated types accurately reflect the schema (e.g., `game_sessions` has `code`, `status`, `host_id`)

**Prerequisites:** Story 1.1

**Technical Notes:**
- Schema definition in `db/schema.ts`.
- Models:
    - `game_sessions`: id (UUID), code (text), status (enum), host_id (UUID)
    - `players`: id (UUID), game_id (UUID), user_id (UUID), character_id (int), is_ready (bool)
    - `moves`: id (UUID), game_id (UUID), player_id (UUID), action_type (enum), details (jsonb)
- Enable RLS (Row Level Security) but keep policies permissive for initial MVP development (refine in later stories).

### Story 1.3: UI Library & Global Styles Setup

As a developer,
I want to configure Tailwind CSS and shadcn/ui with the project's color palette,
So that we can build consistent UI components efficiently.

**Acceptance Criteria:**

**Given** The project is initialized
**When** I install `shadcn/ui` and configure `tailwind.config.ts`
**Then** The color palette from UX Spec (Primary: #4299E1, Secondary: #48BB78, Destructive: #E53E3E, Background: #1A202C) is available as utility classes (e.g., `bg-primary`, `text-destructive`)
**And** I can import and use a basic `Button` component from `@/components/ui/button`
**And** The global font is set to `Inter`

**Prerequisites:** Story 1.1

**Technical Notes:**
- Run `npx shadcn-ui@latest init`.
- Customize `globals.css` and `tailwind.config.ts` to match `docs/ux-design-specification.md`.
- Verify dark mode is the default appearance.

### Story 1.4: Authentication Skeleton (Supabase Auth)

As a developer,
I want to implement basic authentication pages,
So that I can verify user sessions which are required for game creation.

**Acceptance Criteria:**

**Given** The Supabase Auth service is enabled
**When** I visit `/login`
**Then** I see a basic login form (can be Supabase Auth UI or custom form)
**And** I can sign up/sign in with email/password
**And** Upon success, I am redirected to the home page (`/`)
**And** My session is persisted

**Prerequisites:** Story 1.2, Story 1.3

**Technical Notes:**
- Use Supabase Auth Helpers for Next.js App Router.
- Keep it simple: MVP goal is just to have a valid `user_id` for database relations.
- Create a simple `(auth)/login/page.tsx`.

---

## Epic 2: Game Session Management

**Goal:** Enable users to create and join game sessions, ensuring two players can successfully connect and prepare to play.

### Story 2.1: Lobby UI & Game Creation

As a Host,
I want to create a new game and receive a unique code,
So that I can invite a friend to play.

**Acceptance Criteria:**

**Given** I am logged in on the Home page
**When** I click "Start a New Game"
**Then** I am taken to the Game Setup screen
**When** I select a Difficulty (Easy/Medium/Hard) and click "Create"
**Then** A new `game_session` record is created in the DB with `status: 'waiting'`
**And** I am redirected to the Lobby screen (`/game/[code]`)
**And** The unique game code is displayed prominently (UX: Large text, copy button)

**Prerequisites:** Story 1.2, Story 1.3

**Technical Notes:**
- **UX:** See "Journey 1: Starting and Joining a Game" in UX Spec.
- **Arch:** Call API `/api/game/create` (or Supabase directly).
- **Data:** Create `game_sessions` row. Create `players` row for host.
- **Difficulty:** Easy=12 chars, Medium=24, Hard=48. Store in `game_session` metadata.

### Story 2.2: Join Game Functionality

As a Guest,
I want to join an existing game using a code,
So that I can play with the host.

**Acceptance Criteria:**

**Given** I have a valid game code
**When** I enter the code on the Home page and click "Join"
**Then** The system validates the code exists and `status` is `waiting`
**And** If valid, a `players` record is created for me linked to that game
**And** I am redirected to the Lobby screen (`/game/[code]`)
**And** If invalid/full, I see an error message (UX: "Invalid game code" inline)

**Prerequisites:** Story 2.1

**Technical Notes:**
- **UX:** See "Journey 1" Guest Flow.
- **Arch:** Validation logic: Check `game_sessions` where code matches. Check `players` count < 2.
- **Realtime:** This action triggers a `player-joined` event for the Host (handled in Story 2.3).

### Story 2.3: Real-time Lobby & Player Readiness

As a Player (Host or Guest),
I want to see when my opponent joins and signal when I am ready,
So that we can start the game at the same time.

**Acceptance Criteria:**

**Given** I am in the Lobby
**When** The other player joins
**Then** The UI updates instantly to show their avatar/name (via Supabase Realtime)
**When** I click "I'm Ready"
**Then** My status updates to `is_ready: true`
**And** The "Ready" button becomes disabled/green
**When** Both players are `is_ready: true`
**Then** The game automatically transitions to the Gameplay screen

**Prerequisites:** Story 2.2

**Technical Notes:**
- **Arch:** Use `Supabase Realtime` channel `game:[id]`.
- **State:** Subscribe to `INSERT` on `players` table (for joining) and `UPDATE` on `players` (for ready status).
- **UX:** Visual feedback for "Waiting for opponent..." vs "Opponent Ready".

---

## Epic 3: Core Gameplay Loop

**Goal:** Implement the complete turn-based game experience, allowing players to select characters, ask questions, eliminate options, and determine a winner.

### Story 3.1: Game Board & Secret Character Selection [DONE]

As a Player,
I want to see the grid of characters and select my secret identity,
So that the game can begin.

**Acceptance Criteria:**

**Given** The game has started
**Then** I see a grid of character cards (count based on difficulty)
**When** I click a character to select it as my secret identity
**Then** It is highlighted/confirmed
**And** The selection is saved to my `players` record (securely)
**When** Both players have selected
**Then** The main game interface activates, and the first turn is assigned (randomly or Host first)

**Prerequisites:** Epic 2

**Technical Notes:**
- **UX:** Custom `CharacterCard` component (Active/Eliminated states). See UX Spec "Component Library".
- **Arch:** Fetch characters from static assets or DB.
- **Security:** DO NOT expose the opponent's secret character ID in the public `players` object sent to the client. Use RLS or separate API call if strictly needed, but for MVP, client-side filtering of opponent data is risky but acceptable if acknowledged, OR better: store secret in a separate private table/column. *Decision: Keep simple for MVP, but ensure UI doesn't plainly reveal it.*

### Story 3.2: Turn Management System [DONE]

As a Player,
I want to clearly see whose turn it is,
So that I know when I can ask a question or when I need to wait.

**Acceptance Criteria:**

**Given** It is my turn
**Then** The "Ask Question" and "Make Guess" UI is enabled
**And** I see a "Your Turn" indicator
**Given** It is the opponent's turn
**Then** My action UI is disabled
**And** I see "Opponent's Turn"
**When** A turn ends (question asked & answered), ownership switches automatically

**Prerequisites:** Story 3.1

**Technical Notes:**
- **Arch:** `game_sessions` table needs `current_turn_player_id`.
- **Realtime:** Listen for updates to `current_turn_player_id`.
- **UX:** Clear visual distinction (e.g., green border/badge).

### Story 3.3: Question & Answer Interaction [DONE]

As a Player,
I want to ask a yes/no question and receive an answer,
So that I can eliminate characters.

**Acceptance Criteria:**

**Given** It is my turn
**When** I type a question and click "Ask"
**Then** The opponent sees the question immediately (Realtime)
**When** The opponent clicks "Yes" or "No"
**Then** I receive the answer immediately
**And** The interaction is logged in the `moves` table
**And** The turn indicator visually prompts me to eliminate characters

**Prerequisites:** Story 3.2

**Technical Notes:**
- **UX:** "Question Box" UI. See UX Journey 2.
- **Arch:**
    1. Player A sends message -> `moves` insert (action: question).
    2. Player B receives Realtime event.
    3. Player B responds -> `moves` insert (action: answer).
    4. Player A receives Realtime event.

### Story 3.4: Character Elimination Mechanics [DONE]

As a Player,
I want to flip down characters that don't match the answer,
So that I can narrow down the possibilities.

**Acceptance Criteria:**

**Given** I have received an answer
**When** I click on a character card
**Then** It toggles to "Eliminated" state (grayed out/flipped)
**And** This state is preserved locally (Zustand store)
**When** I click "End Turn" (or automatic)
**Then** Control passes to the opponent

**Prerequisites:** Story 3.3

**Technical Notes:**
- **UX:** "Flip down" animation or grayscale filter.
- **State:** Local state in Zustand is sufficient for the board state; doesn't strictly need to be synced to DB unless we want resume capability (Post-MVP). MVP: Local storage or memory.

### Story 3.5: Winning/Losing (The Guess) [DONE]

As a Player,
I want to make a final guess to win the game,
So that the match concludes.

**Acceptance Criteria:**

**Given** It is my turn
**When** I click "Make a Guess" and select a character
**Then** The system checks if it matches the opponent's secret character
**If** Correct -> Update game status to `finished`, set `winner_id` to me. I see "You Win!". Opponent sees "You Lose!".
**If** Incorrect -> Update game status to `finished`, set `winner_id` to opponent. I see "You Lose!". Opponent sees "You Win!".

**Prerequisites:** Story 3.4

**Technical Notes:**
- **UX:** High-stakes confirmation modal ("Are you sure?").
- **Arch:** Server-side validation of the guess is best to prevent cheating. API Route `/api/game/[id]/guess` checks against the hidden secret ID.

### Story 3.6: Tech Debt & Stabilization [DONE]

As a developer,
I want to resolve critical stability issues and technical debt,
So that the codebase is robust for future features.

**Acceptance Criteria:**
- Win/Loss race condition fixed with optimistic updates.
- Zustand persistence implemented.
- Database types updated to include `player_secrets`.
- Game finalization verified with automated tests.

---

## Epic 4: Post-Game Experience

**Goal:** Provide a polished conclusion to the game session and allow players to easily re-engage.

### Story 4.1: Game Over Screens

As a Player,
I want to see a clear "You Win" or "You Lose" screen with the revealed characters,
So that I get closure on the match.

**Acceptance Criteria:**

**Given** The game has ended
**Then** I see a large "You Win" or "You Lose" message
**And** The opponent's secret character is revealed (with image and name)
**And** The final board state remains visible (dimmed or background)

**Prerequisites:** Story 3.5

**Technical Notes:**
- **UX:** Use "Journey 3: Winning the Game" specifications.
- **State:** Driven by `game_session.status === 'finished'` and `winner_id`.

### Story 4.2: Play Again Functionality

As a Player,
I want to be able to play another round with the same friend easily,
So that we don't have to recreate a lobby from scratch.

**Acceptance Criteria:**

**Given** The game is over
**When** I click "Play Again"
**Then** A new game session is created with the same players
**And** Both players are redirected to the new lobby (or the current lobby resets)
**And** Difficulty settings are preserved (or re-selectable)

**Prerequisites:** Story 4.1

**Technical Notes:**
- **Arch:** Simplest approach: "Play Again" button creates a NEW game code and sends it to the opponent via Realtime, or just redirects current user to `/lobby` to start fresh.
- **Refinement:** Ideally, keep the same party and just reset the board. For MVP, "Return to Menu" or "New Game" is acceptable. Let's aim for: "Play Again" redirects host to setup, guest waits or gets new code.

### Story 4.3: Return to Main Menu

As a Player,
I want to leave the game and return to the start screen,
So that I can exit the session.

**Acceptance Criteria:**

**Given** The game is over (or I want to quit)
**When** I click "Return to Main Menu"
**Then** I am redirected to `/`
**And** My session in the current game is marked as inactive (optional cleanup)

**Prerequisites:** Story 4.1

**Technical Notes:**
- Simple navigation.
- Ensure local state (Zustand) is cleared.

---

## FR Coverage Matrix

| FR ID | Description | Covered By |
| :--- | :--- | :--- |
| **FR1.1** | Game Creation | Epic 2, Story 2.1 |
| **FR1.2** | Game Joining | Epic 2, Story 2.2 |
| **FR1.3** | Player Readiness | Epic 2, Story 2.3 |
| **FR2.1** | Secret Selection | Epic 3, Story 3.1 |
| **FR2.2** | Base Char Pool | Epic 3, Story 3.1 |
| **FR3.1** | Turn-Based Play | Epic 3, Story 3.2 |
| **FR3.2** | Q&A | Epic 3, Story 3.3 |
| **FR3.3** | Elimination | Epic 3, Story 3.4 |
| **FR3.4** | Guessing/Win | Epic 3, Story 3.5 |
| **FR4.1** | Difficulty | Epic 2, Story 2.1 |
| **FR4.2** | Post-Game | Epic 4, Story 4.1, 4.2, 4.3 |

---

## Summary

**Total Epics:** 4
**Total Stories:** 12
**Est. Timeline:** MVP Scope (No time estimates per instruction)

**Next Steps:**
1.  **Architecture Refinement:** Confirm API routes for `create` and `join`.
2.  **Implementation:** Start with Epic 1 (Foundation).

_This document will be updated after UX Design and Architecture workflows to incorporate interaction details and technical decisions._