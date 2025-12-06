# Story 1.4: Authentication Skeleton (Supabase Auth)

Status: review

## Story

As a developer,
I want to implement basic authentication pages and session handling,
so that I can verify user sessions which are required for game creation and subsequent game session management.

## Acceptance Criteria
(Sourced from Epic 1 Technical Specification and Epics)

1.  **Given** the Supabase Auth service is enabled
    **When** I visit `/login`
    **Then** I see a basic login form containing Email and Password fields.
2.  **When** I provide valid credentials for sign-up,
    **Then** a new user is created in Supabase.
3.  **When** I provide valid credentials for sign-in or sign-up,
    **Then** I am authenticated.
4.  **When** I am successfully authenticated,
    **Then** I am redirected to the home page (`/`).
5.  **And** my session is persisted across page reloads (handled by Supabase Auth Helpers/@supabase/ssr).

## Tasks / Subtasks

- [x] **Setup Supabase Auth Utilities** (AC: 5)
  - [x] Verify or create `lib/supabase/client.ts` using `@supabase/ssr` `createBrowserClient`.
  - [x] Verify or create `lib/supabase/server.ts` using `@supabase/ssr` `createServerClient`.
  - [x] Create `app/auth/callback/route.ts` to handle OAuth/Magic Link redirects (code exchange) for robust session setting.
- [x] **Install required UI components** (AC: 1)
  - [x] Run `npx shadcn-ui@latest add input label card`.
  - [x] Verify components are added to `components/ui`.
- [x] **Implement Login Page and Form** (AC: 1, 2, 3, 4)
  - [x] Create `app/login/page.tsx` (Server Component) as the entry point (or `app/(auth)/login/page.tsx` per Architecture).
  - [x] Create `components/auth/login-form.tsx` (Client Component) containing the form logic.
  - [x] Implement `signIn` and `signUp` functions using `supabase.auth.signInWithPassword` and `supabase.auth.signUp`.
  - [x] Handle loading states and display error messages using shadcn/ui components.
  - [x] Implement redirect logic to `/` upon success.
- [x] **Testing** (AC: 1, 2, 3, 4, 5)
  - [x] Manually verify basic login form elements are present at `/login`. (AC: 1)
  - [x] Manually verify Sign Up flow creates a new user in Supabase and authenticates. (AC: 2, 3)
  - [x] Manually verify Sign In flow authenticates an existing user. (AC: 3)
  - [x] Manually verify successful authentication redirects to the home page (`/`). (AC: 4)
  - [x] Verify session persistence across page reloads. (AC: 5)

## Dev Notes

- **Relevant architecture patterns and constraints:**
  - Use `@supabase/ssr` for Next.js App Router authentication.
  - Follow the **Feature-Sliced** structure: Auth page in `app/(auth)/login/` or `app/login/`. Architecture suggests `app/(auth)/login/page.tsx`.
  - Use `shadcn/ui` components (`Card`, `Input`, `Label`, `Button`) for the form to maintain visual consistency.
  - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are loaded correctly.
- **Source tree components to touch:**
  - `digital-guess-who/app/(auth)/login/page.tsx` (New)
  - `digital-guess-who/app/auth/callback/route.ts` (New)
  - `digital-guess-who/components/ui/input.tsx`, `label.tsx`, `card.tsx` (New)
  - `digital-guess-who/lib/supabase/client.ts`, `server.ts` (Create/Verify)
- **Testing standards summary:**
  - Manual verification of the auth flow is sufficient for this skeleton story.
  - Ensure no sensitive info is logged to console.

### Project Structure Notes

- Alignment with unified project structure:
  - Auth routes should be in `app/(auth)` group to separate from game logic if preferred, or `app/login` is also acceptable. Architecture explicitly mentions `app/(auth)/login/page.tsx` and `app/api/auth/route.ts`.
  - Reusable auth components can go in `components/auth/` or be inline if specific to the page.

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Authentication-Skeleton-(Story-1.4)] - Tech Spec details.
- [Source: docs/architecture.md#Services-and-Modules] - Defines `lib/supabase` and `app/(auth)` structure.
- [Source: docs/epics.md#Story-1.4:-Authentication-Skeleton-(Supabase-Auth)] - Original story definition.

### Learnings from Previous Story

**From Story 1.3: UI Library & Global Styles Setup (Status: done)**

- **Reuse**: `Button` component is already available at `components/ui/button.tsx`.
- **New UI Test Page**: `digital-guess-who/app/ui-test/page.tsx` was created for visual verification of components.
- **Styling**: Use the `bg-primary`, `text-destructive` etc. utility classes for feedback messages.
- **Technical Debt**: `game-store.test.ts` issue from Story 1.3 remains unresolved due to module resolution issues. This needs to be addressed for full test coverage.
- **Pending Review Items (from Story 1.2)**:
  - [ ] [AI-Review][High] Ensure Supabase CLI is available and run `npx supabase gen types typescript...`. (Still pending from 1.2 review).
- **Previous Story**: `docs/sprint-artifacts/1-3-ui-library-global-styles-setup.md`

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-4-authentication-skeleton-supabase-auth.context.xml

### Agent Model Used

gemini-2.5-flash

### Debug Log References

### Completion Notes List

- Implemented authentication skeleton using `@supabase/ssr`.
- Refactored auth pages to `app/(auth)` group for cleaner routing (`/login`, `/sign-up`).
- Consolidated auth forms into `components/auth/`.
- Added Sign Up functionality and routing.
- Verified build success and updated UI Test page for visual verification.

### File List

- digital-guess-who/app/(auth)/login/page.tsx
- digital-guess-who/app/(auth)/sign-up/page.tsx
- digital-guess-who/app/(auth)/forgot-password/page.tsx
- digital-guess-who/app/auth/callback/route.ts
- digital-guess-who/components/auth/login-form.tsx
- digital-guess-who/components/auth/sign-up-form.tsx
- digital-guess-who/components/auth/forgot-password-form.tsx
- digital-guess-who/app/ui-test/page.tsx
- digital-guess-who/jest.config.ts

