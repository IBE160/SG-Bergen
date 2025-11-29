# Story 1.4: Authentication Skeleton (Supabase Auth)

Status: ready-for-dev

## Story

As a developer,
I want to implement basic authentication pages,
So that I can verify user sessions which are required for game creation.

## Acceptance Criteria

1. **Given** The Supabase Auth service is enabled
2. **When** I visit `/login`
3. **Then** I see a basic login form
4. **And** I can sign up/sign in with email/password
5. **And** Upon success, I am redirected to the home page (`/`)
6. **And** My session is persisted

## Tasks / Subtasks

- [ ] Task 1: Create login page component (AC: 2, 3)
  - [ ] Create file `app/(auth)/login/page.tsx`.
  - [ ] Add a simple form with email and password inputs and a submit button.
- [ ] Task 2: Implement sign-up and sign-in logic (AC: 4)
  - [ ] Use `@supabase/auth-helpers-nextjs` to handle form submission.
  - [ ] Implement both sign-up and sign-in functionality.
- [ ] Task 3: Handle redirection and session management (AC: 5, 6)
  - [ ] On successful authentication, redirect the user to the home page.
  - [ ] Verify that the user session is correctly managed by the Supabase Auth Helper.

## Dev Notes

- **Architecture:** Use Supabase Auth Helpers for Next.js App Router. The MVP goal is to obtain a valid `user_id` for database relations.
- **File to Create:** `app/(auth)/login/page.tsx`.
- **Simplicity:** Keep the UI and logic minimal for this initial implementation. No need for complex password validation or "forgot password" flows at this stage.

### Project Structure Notes

- **Authentication Module (`app/(auth)`):** The creation of `app/(auth)/login/page.tsx` aligns with the feature-sliced design by creating a dedicated module for authentication. This ensures separation of concerns and maintainability.
- **Supabase Integration (`lib/supabase`):** The use of Supabase Auth Helpers aligns with the established `lib/supabase` directory for all Supabase-related configurations and client instances.



### References

- [Source: docs/architecture.md#Authentication]
- [Source: docs/epics.md#Story-1.4]
- [Source: docs/tech-spec-epic-1.md#Story-1.4]

## Change Log
- [{{date}}] Drafted story based on PRD, Epics, and Architecture.

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1.4.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
