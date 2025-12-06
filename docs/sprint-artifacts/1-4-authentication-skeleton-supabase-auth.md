# Story 1.4: Authentication Skeleton (Supabase Auth)

Status: drafted

## Story

As a developer,
I want to implement basic authentication pages and session handling,
so that I can verify user sessions which are required for game creation and subsequent game session management.

## Acceptance Criteria
(Sourced from Epic 1 Technical Specification and Epics)

1.  **Given** the Supabase Auth service is enabled
    **When** I visit `/login`
    **Then** I see a basic login form containing Email and Password fields.
2.  **And** I can toggle between "Sign Up" and "Sign In" modes (or have separate actions).
3.  **When** I sign up with a valid email and password
    **Then** a new user is created in Supabase and I am redirected to the home page (`/`) with a valid session.
4.  **When** I sign in with existing credentials
    **Then** I am authenticated and redirected to the home page (`/`).
5.  **And** if I enter invalid credentials, I see an appropriate error message.
6.  **And** my session is persisted across page reloads (handled by Supabase Auth Helpers/@supabase/ssr).

## Tasks / Subtasks

- [ ] **Setup Supabase Auth Utilities** (AC: 6)
  - [ ] Verify or create `lib/supabase/client.ts` using `@supabase/ssr` `createBrowserClient`.
  - [ ] Verify or create `lib/supabase/server.ts` using `@supabase/ssr` `createServerClient`.
  - [ ] Create `app/auth/callback/route.ts` to handle OAuth/Magic Link redirects (code exchange) for robust session setting.
- [ ] **Install required UI components** (AC: 1)
  - [ ] Run `npx shadcn-ui@latest add input label card`.
  - [ ] Verify components are added to `components/ui`.
- [ ] **Implement Login Page and Form** (AC: 1, 2, 3, 4, 5)
  - [ ] Create `app/login/page.tsx` (Server Component) as the entry point (or `app/(auth)/login/page.tsx` per Architecture).
  - [ ] Create `components/auth/login-form.tsx` (Client Component) containing the form logic.
  - [ ] Implement `signIn` and `signUp` functions using `supabase.auth.signInWithPassword` and `supabase.auth.signUp`.
  - [ ] Handle loading states and display error messages using shadcn/ui components.
  - [ ] Implement redirect logic to `/` upon success.
- [ ] **Testing**
  - [ ] Manually verify Sign Up flow creates a user in Supabase.
  - [ ] Manually verify Sign In flow redirects to Home.
  - [ ] Verify session persistence by refreshing the page.

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
- **Styling**: Use the `bg-primary`, `text-destructive` etc. utility classes for feedback messages.
- **Pending Review Items (from Story 1.2)**:
  - [ ] [AI-Review][High] Ensure Supabase CLI is available and run `npx supabase gen types typescript...`. (Still pending from 1.2 review).
- **Previous Story**: `docs/sprint-artifacts/1-3-ui-library-global-styles-setup.md`

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

gemini-2.5-flash

### Debug Log References

### Completion Notes List

### File List

