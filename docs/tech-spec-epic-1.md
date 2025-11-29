# Epic Technical Specification: Project Foundation

Date: lørdag 29. november 2025
Author: BIP
Epic ID: 1
Status: Draft

---

## Overview

"Digital Guess Who" reimagines the classic board game for the modern web. Epic 1 focuses on establishing the core technical infrastructure, development environment, and deployment pipeline using Next.js and Supabase. This forms the foundational layer for all subsequent feature development, ensuring a robust and production-ready environment from the outset.

## Objectives and Scope

**Objectives:**
*   Establish core technical infrastructure (Next.js + Supabase).
*   Set up a tailored UI library (shadcn/ui + Tailwind).
*   Initialize database schema.
*   Configure deployment to Vercel.

**In Scope:**
*   Project scaffolding (Next.js + Supabase).
*   UI library setup (shadcn/ui + Tailwind).
*   Database schema initialization.
*   Deployment to Vercel.
*   Basic authentication pages for user sessions.

**Out of Scope:**
*   Advanced authentication features (e.g., social login, password reset).
*   Complex database migrations.
*   Comprehensive UI component library development beyond `shadcn/ui` integration.

## System Architecture Alignment

The architecture leverages Next.js (App Router) + Supabase, with Supabase Realtime and Zustand for state management. Epic 1 aligns with establishing this foundation by initiating the project with the Next.js + Supabase starter, configuring the database schema, setting up the UI library with Tailwind and `shadcn/ui`, and ensuring deployment to Vercel. This step directly implements the "Project Foundation" decision described in the Architecture document.

## Detailed Design

### Services and Modules

*   **Next.js Application:** Serves as the web framework, handling frontend rendering and API routes (`app/`).
*   **Supabase:** Provides managed PostgreSQL database, authentication services, and real-time capabilities.
*   **Database Schema (`db/schema.ts`):** Defines the structure of the application's data models.
*   **Generated Types (`database.types.ts`):** Type-safe interaction with the Supabase database.
*   **UI Library (`shadcn/ui`):** A collection of re-usable components built on Radix UI and styled with Tailwind CSS, located in `components/ui/`.
*   **Authentication Pages (`app/(auth)/login/page.tsx`):** Handles user sign-up and sign-in functionality using Supabase Auth.
*   **Styling Configuration (`tailwind.config.ts`, `globals.css`):** Defines the project's visual style and integrates Tailwind CSS with `shadcn/ui`.

### Data Models and Contracts

The initial database schema, defined in `db/schema.ts`, includes the following core models:

*   **`game_sessions`**:
    *   `id` (UUID): Primary key, unique identifier for the game session.
    *   `code` (text): Unique, human-readable code for joining the game.
    *   `status` (enum: `waiting`, `active`, `finished`): Current state of the game.
    *   `host_id` (UUID): Foreign key referencing the `user` who created the session.
    *   `created_at` (timestamp with time zone): Timestamp of game creation.
*   **`players`**:
    *   `id` (UUID): Primary key, unique identifier for the player in a game.
    *   `user_id` (UUID): Foreign key referencing the `user` playing.
    *   `game_id` (UUID): Foreign key referencing the `game_session` they are part of.
    *   `character_id` (int): ID of the character selected by the player (secret).
    *   `is_ready` (boolean): Flag indicating if the player is ready to start the game.
*   **`moves`**:
    *   `id` (UUID): Primary key, unique identifier for a game move.
    *   `game_id` (UUID): Foreign key referencing the `game_session`.
    *   `player_id` (UUID): Foreign key referencing the `player` who made the move.
    *   `action_type` (enum: `question`, `answer`, `guess`, `flip`): Type of action performed.
    *   `details` (jsonb): JSON object storing additional move-specific data (e.g., question text, answer, guessed character).
    *   `created_at` (timestamp with time zone): Timestamp of the move.
*   **`users`**: (Managed by Supabase Auth, not explicitly defined in `db/schema.ts` for MVP)
    *   `id` (UUID): Primary key.
    *   `username` (text): User's display name.
    *   `avatar_url` (text): URL to user's avatar.

### APIs and Interfaces

*   **Supabase Authentication API:**
    *   Standard endpoints provided by Supabase for user registration, login, and session management.
    *   Examples: `/auth/v1/signup`, `/auth/v1/signin`, `/auth/v1/user`.
    *   Accessed client-side via `@supabase/supabase-js` and server-side via Supabase client library.

*   **Next.js API Routes (Initial Structure):**
    *   `app/api/auth/callback/route.ts`: Handles OAuth callbacks from Supabase for session exchange.
    *   No custom game-specific API routes are introduced in Epic 1, but the foundational structure for future game API routes will be in `app/api/game/[game-id]/route.ts`.
    *   **External Interfaces:** None directly exposed by Epic 1 beyond the Next.js application and Supabase SDK.

### Workflows and Sequencing

The implementation of Epic 1 will follow the sequence of its stories:

1.  **Story 1.1: Project Scaffolding & Vercel Deployment:**
    *   Execute `npx create-next-app -e with-supabase digital-guess-who`.
    *   Configure the Vercel project and link it to the GitHub repository.
    *   Ensure successful initial deployment to a live URL.

2.  **Story 1.2: Database Schema & Type Generation:**
    *   Define the initial database schema in `db/schema.ts` (or equivalent SQL migration).
    *   Apply the schema to the Supabase project.
    *   Generate TypeScript types using `supabase gen types typescript`.

3.  **Story 1.3: UI Library & Global Styles Setup:**
    *   Install `shadcn/ui` components and configure `tailwind.config.ts`.
    *   Apply the color palette and typography from the UX Design Specification.
    *   Set up global styles in `globals.css`.

4.  **Story 1.4: Authentication Skeleton (Supabase Auth):**
    *   Implement basic login and signup pages (e.g., `app/(auth)/login/page.tsx`).
    *   Integrate Supabase Auth Helpers for handling user sessions and redirects.

## Non-Functional Requirements

### Performance

*   Game state changes (e.g., character eliminations, turn transitions) shall synchronize between players with a latency of less than 500ms.
*   The UI elimination mechanic shall have a visual response time under 100ms.
*   Supabase Realtime's "Broadcast" mode will be utilized for efficient, low-latency transmission of transient game events.
*   Optimistic UI updates will be implemented using Zustand to provide immediate user feedback, with subsequent reconciliation against server state.

### Security

*   User authentication will be managed securely via Supabase Auth.
*   Game session and player data shall be protected from unauthorized access or manipulation through Supabase Row Level Security (RLS) policies.
*   API keys and other sensitive configurations will be managed via `.env.local` and Vercel Environment Variables, and never committed to version control.

### Reliability/Availability

*   The system aims for high stability to ensure two players can successfully complete a full game loop without critical bugs or disconnections.
*   Leverage Vercel's managed service for automatic deployments to ensure continuous availability and rapid recovery from deployment issues.
*   Supabase, as a managed service, contributes to overall system reliability and data persistence.

### Observability

*   Structured logging will be implemented for critical game events to facilitate monitoring and debugging.
*   Log format: `[Level] [Context] Message { metadata }`, e.g., `[INFO] [GameEngine] Player connected { userId: "...", gameId: "..." }`.

### Dependencies and Integrations

**Core Technologies:**
*   **Frontend Framework:** Next.js 15+ (App Router)
*   **Language:** TypeScript 5.x
*   **Database:** PostgreSQL (via Supabase)
*   **Authentication:** Supabase Auth
*   **Styling:** Tailwind CSS 4.x
*   **State Management:** Zustand (Client), Supabase Realtime (Server Sync)
*   **UI Library:** shadcn/ui (Radix UI + Tailwind)
*   **Hosting:** Vercel

**Key Libraries/SDKs:**
*   `@supabase/supabase-js`: Supabase client library for database and auth interactions.
*   `@supabase/auth-helpers-nextjs`: Helper library for Supabase Auth integration with Next.js App Router.
*   `react`: Core React library.
*   `tailwindcss`: CSS framework.
*   `shadcn/ui` related packages (e.g., `@radix-ui/react-slot`).

**Integration Points:**
*   **Client <=> Supabase:** Direct interaction using `@supabase/supabase-js`.
*   **Next.js API <=> Supabase:** Server-side interaction for protected operations.
*   **Client <=> Next.js API:** Standard `fetch` calls for server-side logic.


### Acceptance Criteria (Authoritative)

**Story 1.1: Project Scaffolding & Vercel Deployment**
1.  **Given** I have the necessary Vercel and Supabase credentials
2.  **When** I run the initialization command `npx create-next-app -e with-supabase`
3.  **Then** A new Next.js 15+ (App Router) project is created with TypeScript
4.  **And** The project is connected to a Vercel project
5.  **And** A successful build is deployed to a production URL (e.g., `digital-guess-who.vercel.app`)
6.  **And** The repository is pushed to GitHub

**Story 1.2: Database Schema & Type Generation**
1.  **Given** The Supabase project is active
2.  **When** I run the SQL migration script defined in Architecture
3.  **Then** Tables for `users`, `game_sessions`, `players`, and `moves` are created in the public schema
4.  **And** I can run `supabase gen types typescript` to generate `database.types.ts`
5.  **And** The generated types accurately reflect the schema (e.g., `game_sessions` has `code`, `status`, `host_id`)

**Story 1.3: UI Library & Global Styles Setup**
1.  **Given** The project is initialized
2.  **When** I install `shadcn/ui` and configure `tailwind.config.ts`
3.  **Then** The color palette from UX Spec is available as utility classes (e.g., `bg-primary`, `text-destructive`)
4.  **And** I can import and use a basic `Button` component from `@/components/ui/button`
5.  **And** The global font is set to `Inter`

**Story 1.4: Authentication Skeleton (Supabase Auth)**
1.  **Given** The Supabase Auth service is enabled
2.  **When** I visit `/login`
3.  **Then** I see a basic login form
4.  **And** I can sign up/sign in with email/password
5.  **And** Upon success, I am redirected to the home page (`/`)
6.  **And** My session is persisted

### Traceability Mapping

| Acceptance Criteria ID | Spec Section(s) | Component(s)/API(s) | Test Idea |
| :--------------------- | :-------------- | :------------------ | :-------- |
| **Story 1.1: Project Scaffolding & Vercel Deployment** |
| 1.1.3 (Next.js created) | Architecture (Project Init) | `next.config.js`, `tsconfig.json` | Verify `package.json` scripts and `next.config.js` |
| 1.1.4 (Vercel connected) | Architecture (Deployment) | Vercel CLI, Vercel Dashboard | Check Vercel project settings |
| 1.1.5 (Deployed URL) | Architecture (Deployment) | Vercel Deployment | Access URL, verify basic Next.js welcome page |
| 1.1.6 (Repo pushed) | Architecture (Project Init) | `.git` history, GitHub repo | Confirm remote GitHub repository exists |
| **Story 1.2: Database Schema & Type Generation** |
| 1.2.3 (Tables created) | Architecture (Data Models), Epic 1.2 | Supabase Dashboard, `db/schema.ts` | Inspect Supabase DB tables via UI/CLI |
| 1.2.4 (Types generated) | Architecture (Data Models), Epic 1.2 | `database.types.ts` | Verify `database.types.ts` file exists and is populated |
| 1.2.5 (Types accurate) | Architecture (Data Models), Epic 1.2 | `database.types.ts` | Compare generated types to `db/schema.ts` |
| **Story 1.3: UI Library & Global Styles Setup** |
| 1.3.3 (Color palette) | UX (Color System), Epic 1.3 | `tailwind.config.ts`, `globals.css` | Inspect CSS utility classes, e.g., `bg-primary` |
| 1.3.4 (Button component) | UX (Component Library), Epic 1.3 | `@/components/ui/button.tsx` | Import and render `Button` component, verify styling |
| 1.3.5 (Global font) | UX (Typography), Epic 1.3 | `globals.css` | Inspect rendered text in browser dev tools |
| **Story 1.4: Authentication Skeleton (Supabase Auth)** |
| 1.4.3 (Login form) | Architecture (Auth), Epic 1.4 | `app/(auth)/login/page.tsx` | Navigate to `/login`, verify form elements |
| 1.4.4 (Sign up/in) | Architecture (Auth), Epic 1.4 | Supabase Auth API | Perform signup/signin flow, check Supabase Auth logs |
| 1.4.5 (Redirect Home) | Architecture (Auth), Epic 1.4 | `app/(auth)/login/page.tsx` | Observe browser redirect after successful auth |
| 1.4.6 (Session persisted) | Architecture (Auth), Epic 1.4 | Browser storage, Supabase Auth | Refresh page after login, verify user session still active |

### Risks, Assumptions, Open Questions

**Risks:**
*   **Supabase Realtime Complexity:** Ensuring robust and low-latency synchronization of game state might be more complex than anticipated.
*   **Security RLS Policies:** Properly securing game data with Row Level Security (RLS) in Supabase to prevent cheating or unauthorized access could introduce unexpected challenges.
*   **UI Customization:** Maintaining consistency and accessibility while heavily customizing `shadcn/ui` components and Tailwind CSS.

**Assumptions:**
*   The `npx create-next-app -e with-supabase` starter provides a production-ready and performant foundation without significant bespoke configuration.
*   Vercel deployment will be straightforward, leveraging its native integration with Next.js and Git.
*   `shadcn/ui` components offer sufficient flexibility to meet all UX design specifications for Epic 1's UI requirements.

**Open Questions:**
*   What is the detailed error handling strategy for Supabase API calls and Realtime events (e.g., network disconnects)?
*   Are there specific environment variable management processes (local, staging, production) that need to be documented or automated?
*   Beyond Supabase, are there any other third-party services (e.g., analytics, crash reporting) that need to be integrated within Epic 1's scope?


### Test Strategy Summary

The testing strategy for Epic 1 will encompass a multi-layered approach:

*   **Unit Tests:**
    *   **Focus:** Isolated functions, utility helpers, and pure React components (e.g., `Button` from `shadcn/ui` with custom styling).
    *   **Frameworks:** Jest and React Testing Library.
*   **Integration Tests:**
    *   **Focus:** Interaction with Supabase (Auth, Database CRUD operations), Next.js API routes, and the integration of multiple UI components.
    *   **Frameworks:** Jest, potentially with a mocked Supabase client or a dedicated test Supabase project.
*   **End-to-End (E2E) Tests:**
    *   **Focus:** Verification of core user journeys, such as project initialization (`npx create-next-app`), database schema application, and successful authentication flow.
    *   **Frameworks:** Playwright or Cypress (to be decided).
*   **Manual Testing:**
    *   **Focus:** Crucial for UI/UX validation, cross-browser compatibility (Chrome, Firefox desktop), and visual regression testing after `shadcn/ui` integration.
*   **Coverage:** Prioritize test coverage for critical paths related to project setup, database integrity, and user authentication as defined by the Acceptance Criteria.

