# Epic Technical Specification: Project Scaffolding and Core Setup

Date: 2025-12-05
Author: BIP
Epic ID: epic-1
Status: Draft

---

## Overview

Epic 1, "Project Foundation," is critical for establishing the robust technical bedrock of "Digital Guess Who." This initial phase focuses on setting up the core infrastructure, development environment, and deployment pipeline. It ensures that the project, a modern web-based adaptation of the classic board game, has a stable and efficient platform for future feature development. By leveraging Next.js with App Router, Supabase, and Tailwind CSS, this epic directly supports the project's aim to deliver a high-quality, stable, and intuitive web application that demonstrates professional development practices as outlined in the PRD's Executive Summary and Project Classification.

## Objectives and Scope

The primary objective of Epic 1 is to create a fully functional and deployable base application environment.

*   **In-scope for Epic 1:**
    *   Project scaffolding using the Next.js + Supabase starter template.
    *   Configuration of the development environment with TypeScript, ESLint, and Prettier.
    *   Initial database schema definition for core entities (users, game sessions, players, moves) in Supabase.
    *   Generation of type-safe client for database interactions.
    *   Integration of Tailwind CSS and shadcn/ui with the project's custom color palette and typography.
    *   Setup of basic authentication (sign-up/sign-in) using Supabase Auth, providing user session management.
    *   Deployment to Vercel, establishing a continuous deployment pipeline and a live URL.

*   **Out-of-scope for Epic 1:**
    *   Any game-specific UI components beyond basic buttons and styling.
    *   Real-time game logic or state management.
    *   Complex user roles or permissions beyond basic authenticated/unauthenticated.
    *   Detailed game asset integration (e.g., character images beyond basic placeholders).
    *   Comprehensive error handling and user feedback mechanisms for gameplay.

## System Architecture Alignment

Epic 1 directly implements foundational architectural decisions to align with the Next.js + Supabase stack. The scaffolding, database setup, and UI library integration are cornerstones. Specifically, it aligns with:

*   **Project Initialization:** Utilizes the Vercel Next.js + Supabase starter for a production-ready foundation, accelerating setup and reducing boilerplate.
*   **Data Persistence:** Initializes Supabase (PostgreSQL) for relational data, as defined for game sessions and player management.
*   **Styling & Component Library:** Integrates Tailwind CSS and `shadcn/ui` to support rapid, consistent UI development based on the decided component strategy.
*   **Authentication:** Establishes Supabase Auth, a critical component for secure user access and game session control.
*   **Hosting:** Configures Vercel for native Next.js optimization and seamless deployment.


## Detailed Design

### Services and Modules

Epic 1 primarily focuses on establishing the foundational services and modules that will be leveraged by all subsequent game features.

*   **Next.js Application Core:** The primary web application, utilizing Next.js (App Router) for routing, server components, and API routes. Key files include `app/layout.tsx` for global structure and `next.config.js`.
*   **Supabase Integration (`lib/supabase/`):**
    *   `client.ts`: Client-side Supabase instance for direct interaction with Supabase services (Auth, Database, Realtime).
    *   `server.ts`: Server-side Supabase instance, potentially used for privileged operations within Next.js API routes or server components.
*   **Database Schema (`db/`):** Contains the definitions for the PostgreSQL tables managed by Supabase, including `schema.ts` for declarative definitions and generated `types.ts` for type-safe interactions.
*   **UI Library (`components/ui/`):** Integration of `shadcn/ui` components for reusable, accessible UI primitives (e.g., Button, Input, Card). This module ensures consistent styling and behavior across the application.
*   **Global Styles (`globals.css`):** Configuration for Tailwind CSS to define the project's design tokens (colors, typography, spacing) as utility classes.
*   **Authentication Module (`app/(auth)/`):** Provides the basic user authentication flows (login, signup) using Supabase Auth, establishing user sessions. This involves routes like `app/(auth)/login/page.tsx`.

### Data Models and Contracts

Epic 1 defines the initial structure for core data models that underpin the entire game. These models are implemented in Supabase (PostgreSQL) and are consumed via generated TypeScript types.

*   **User:**
    *   Represents a player in the system.
    *   `id` (UUID): Unique identifier, typically from Supabase Auth.
    *   `username` (text): User's display name.
    *   `avatar_url` (text): URL to user's avatar.
*   **GameSession:**
    *   Represents an active game instance.
    *   `id` (UUID): Unique game session identifier.
    *   `code` (text): Short, shareable code for joining a game.
    *   `status` (enum: 'waiting' | 'active' | 'finished'): Current state of the game.
    *   `host_id` (UUID): Foreign key to the `User` who created the session.
    *   `winner_id` (UUID, nullable): Foreign key to the `User` who won the game.
    *   `created_at` (timestamp): Timestamp of creation.
*   **Player:**
    *   Links a `User` to a `GameSession`.
    *   `id` (UUID): Unique player instance ID within a game.
    *   `user_id` (UUID): Foreign key to the `User` table.
    *   `game_id` (UUID): Foreign key to the `GameSession` table.
    *   `character_id` (integer): ID of the secretly chosen character (initially null).
    *   `is_ready` (boolean): Flag indicating player readiness in the lobby.
*   **Move:**
    *   Records actions taken during a game.
    *   `id` (UUID): Unique move identifier.
    *   `game_id` (UUID): Foreign key to the `GameSession`.
    *   `player_id` (UUID): Foreign key to the `Player` who made the move.
    *   `action_type` (enum: 'question' | 'answer' | 'guess' | 'flip'): Type of action.
    *   `details` (JSONB): JSON object for action-specific data (e.g., question text, guessed character ID).
    *   `created_at` (timestamp): Timestamp of the move.

Type generation (`supabase gen types typescript`) ensures `database.types.ts` accurately reflects these schemas, providing type-safety across the application.

### APIs and Interfaces

Epic 1 primarily establishes the fundamental interfaces for interacting with Supabase and laying the groundwork for internal Next.js APIs.

*   **Supabase Client (`@supabase/supabase-js`):** The primary interface for client-side interactions, used for:
    *   **Authentication:** `supabase.auth.signInWithPassword()`, `supabase.auth.signUp()`, `supabase.auth.signOut()`, `supabase.auth.getUser()`.
    *   **Database CRUD:** Direct interaction with `supabase.from('table_name').select()...` where Row Level Security (RLS) policies permit.
*   **Next.js API Routes:** While not extensively built out in Epic 1, the project structure (`app/api/`) is established. Initial API routes will likely focus on:
    *   **Auth Callbacks:** Handling redirects and session management for Supabase Auth.
    *   **Health Checks:** Basic endpoint to verify application health.
*   **Internal Interfaces:** TypeScript interfaces and types defined within the application to ensure data consistency and enable type-safe component development (e.g., `interface Character { id: number; name: string; image: string; }`).

### Workflows and Sequencing

Epic 1 defines a sequential workflow to bootstrap the project, focusing on establishing a solid and extensible foundation.

1.  **Project Scaffolding (Story 1.1):**
    *   Initialize Next.js project using `create-next-app` with Supabase integration.
    *   Configure basic repository and Vercel deployment for a live, production-ready environment.
2.  **Database Schema & Type Generation (Story 1.2):**
    *   Define initial database schema (`game_sessions`, `players`, `moves`, `users`) in `db/schema.ts`.
    *   Run Supabase CLI to generate TypeScript types (`database.types.ts`) for type-safe database access.
3.  **UI Library & Global Styles Setup (Story 1.3):**
    *   Install and configure Tailwind CSS and `shadcn/ui`.
    *   Apply the project's color palette, typography (`Inter`), and global styles defined in `globals.css` and `tailwind.config.ts`.
4.  **Authentication Skeleton (Story 1.4):**
    *   Implement basic user registration and login functionality using Supabase Auth.
    *   Create `app/(auth)/login/page.tsx` for user authentication, redirecting to the home page on success.

This sequence ensures that foundational elements are in place and verified before proceeding to more complex game logic.


## Non-Functional Requirements

### Performance

*   **Page Load:** Initial paint for the application shell should be under 1.5 seconds on a standard broadband connection, leveraging Next.js static optimization and Vercel's edge network.
*   **Client Bundle Size:** Keep the initial JavaScript payload minimal by using Next.js App Router features like server components and code splitting. Target bundle size for the initial route should be monitored but is not strictly constrained at this stage beyond standard best practices.
*   **Database Connectivity:** Connection to Supabase should be robust, with reasonable query latency for basic operations (aiming for <100ms for simple reads/writes in the same region).

### Security

*   **Data Protection:** All data in transit must be encrypted via HTTPS (enforced by Vercel and Supabase).
*   **Access Control (Initial):** Basic Row Level Security (RLS) policies will be enabled on database tables. While initially permissive to facilitate rapid development, the infrastructure for fine-grained access control (e.g., `auth.uid() = user_id`) is established.
*   **Secret Management:** API keys and sensitive configuration (Supabase URL, Anon Key) must be stored securely using environment variables (`.env.local` for local development, Vercel Environment Variables for production) and never committed to the repository.

### Reliability/Availability

*   **Uptime:** Leverage Vercel's platform reliability for application hosting. Supabase's managed service provides database availability.
*   **Error Handling (Basic):** The application should handle basic connectivity errors gracefully, preventing full application crashes. While comprehensive error boundaries are a later concern, basic `try/catch` blocks should be used around initial API/database calls.
*   **Deployment:** Automated deployments via Vercel on push to the `main` branch ensure a consistent and reliable release pipeline.

### Observability

*   **Logging:** Basic structured logging for key events (e.g., successful DB connection, authentication errors) should be implemented.
    *   Format: `[Level] [Context] Message { metadata }`
*   **Deployment Logs:** Utilization of Vercel's build and runtime logs for diagnosing deployment and server-side issues.
*   **Database Monitoring:** Basic monitoring of database health and performance metrics available via the Supabase dashboard.

## Dependencies and Integrations

*   **Frontend Framework:** Next.js 15+ (App Router)
*   **Language:** TypeScript 5.x
*   **Database:** PostgreSQL (via Supabase)
*   **Authentication:** Supabase Auth
*   **Styling:** Tailwind CSS 4.x
*   **State Management:** Zustand (Client), Supabase Realtime (Server Sync)
*   **UI Library:** shadcn/ui (Radix UI + Tailwind)
*   **Hosting:** Vercel


## Acceptance Criteria (Authoritative)

1.  **Project Scaffolding & Vercel Deployment:**
    *   A new Next.js 15+ (App Router) project is created with TypeScript and connected to a Vercel project.
    *   A successful build is deployed to a production URL.
    *   The repository is pushed to GitHub.
2.  **Database Schema & Type Generation:**
    *   Tables for `users`, `game_sessions`, `players`, and `moves` are created in the public schema of Supabase.
    *   TypeScript types (`database.types.ts`) are generated, accurately reflecting the schema.
3.  **UI Library & Global Styles Setup:**
    *   The color palette from UX Spec is available as Tailwind utility classes.
    *   A basic `Button` component from `@/components/ui/button` can be imported and used.
    *   The global font is set to `Inter`.
4.  **Authentication Skeleton (Supabase Auth):**
    *   A basic login form is accessible at `/login`.
    *   Users can sign up/sign in with email/password.
    *   Upon successful authentication, users are redirected to the home page (`/`).
    *   The user session is persisted.

## Traceability Mapping

| Acceptance Criteria | Spec Section(s) | Component(s)/API(s) | Test Idea |
| :------------------ | :-------------------- | :------------------ | :-------------------- |
| 1.1 Project scaffolding | Overview, Detailed Design (Services/Modules) | `next.config.js`, Vercel Deployment | Verify Vercel deployment logs and live URL. |
| 1.2 DB Schema & Types | Detailed Design (Data Models) | Supabase DB, `db/schema.ts`, `database.types.ts` | Inspect Supabase tables; `git diff` generated types. |
| 1.3 UI Library & Styles | Detailed Design (Services/Modules) | `tailwind.config.ts`, `globals.css`, `Button` component | Render button and inspect element for styles/classnames. |
| 1.4 Auth Skeleton | Detailed Design (Services/Modules, APIs) | Supabase Auth, `app/(auth)/login/page.tsx` | Manual test: sign up, log in, verify redirection and session. |


## Risks, Assumptions, Open Questions

*   **Risk:** `create-next-app` with Supabase starter might have breaking changes or require significant adjustments upon initialization, impacting the timeline for Epic 1.
    *   **Mitigation:** Verify `npx create-next-app -e with-supabase` command for latest compatibility before execution.
*   **Assumption:** Vercel deployment and Supabase project setup (including RLS for initial database security) are straightforward and well-documented.
    *   **Mitigation:** Allocate time for reviewing official documentation and troubleshooting common setup issues.
*   **Open Question:** What is the exact SQL migration script for the initial schema, or will it be defined programmatically through an ORM?
    *   **Next Step:** Define the precise schema DDL in `db/schema.ts` and confirm migration strategy.
*   **Risk:** `shadcn/ui` and Tailwind CSS configuration might require non-trivial customization to perfectly match UX specifications, leading to delays.
    *   **Mitigation:** Prototyping key UI elements early to validate integration and customization effort.

## Test Strategy Summary

For Epic 1, the test strategy will focus on verifying the successful setup and basic functionality of the project's foundation.

*   **Unit/Integration Tests:**
    *   **Database:** Verify generated types match schema. Test basic CRUD operations against mock Supabase client or a test database.
    *   **Authentication:** Unit test authentication functions (e.g., login, logout) ensuring correct state changes and error handling.
    *   **UI Components:** Basic snapshot tests for `shadcn/ui` components after customization to ensure consistent rendering.
*   **End-to-End (E2E) Testing:**
    *   Verify successful project deployment to Vercel.
    *   Confirm basic navigation to login page and successful authentication flow (signup/signin/signout).
    *   Visual inspection of global styles and `shadcn/ui` component rendering (e.g., buttons, inputs) in the browser.
*   **Developer Experience (DX) Testing:**
    *   Verify `ESLint` and `Prettier` configurations are correctly applied during development.
    *   Ensure type generation (`supabase gen types`) runs without errors and produces expected output.
*   **Accessibility Testing:**
    *   Initial automated checks using tools like `axe-core` on the login and home pages.
    *   Manual keyboard navigation checks for basic interactive elements.

