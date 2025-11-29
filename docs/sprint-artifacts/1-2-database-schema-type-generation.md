# Story 1.2: Database Schema & Type Generation

Status: ready-for-dev

## Story

As a developer,
I want to define the initial Supabase database schema and generate TypeScript types,
So that we can interact with the database using type-safe methods.

## Acceptance Criteria

1.  **Given** The Supabase project is active
2.  **When** I run the SQL migration script defined in Architecture
3.  **Then** Tables for `users`, `game_sessions`, `players`, and `moves` are created in the public schema
4.  **And** I can run `supabase gen types typescript` to generate `database.types.ts`
5.  **And** The generated types accurately reflect the schema (e.g., `game_sessions` has `code`, `status`, `host_id`)

## Tasks / Subtasks

- [ ] **Task: Define Supabase Schema (AC: 2, 3)**
  - [ ] Create `db/schema.ts` and define SQL for `users`, `game_sessions`, `players`, and `moves` tables as per Architecture and Epic details.
  - [ ] Include columns `id` (UUID), `code` (text), `status` (enum), `host_id` (UUID) for `game_sessions`.
  - [ ] Include columns `id` (UUID), `game_id` (UUID), `user_id` (UUID), `character_id` (int), `is_ready` (bool) for `players`.
  - [ ] Include columns `id` (UUID), `game_id` (UUID), `player_id` (UUID), `action_type` (enum), `details` (jsonb) for `moves`.
  - [ ] Enable Row Level Security (RLS) for all tables with permissive policies initially.
  - [ ] **Test Subtask:** Verify schema syntax is valid SQL.
- [ ] **Task: Run Migration Script (AC: 3)**
  - [ ] Execute the generated SQL migration script against the Supabase database.
  - [ ] **Test Subtask:** Verify tables are created in the Supabase UI.
- [ ] **Task: Generate TypeScript Types (AC: 4, 5)**
  - [ ] Run `supabase gen types typescript --project-id <your-project-id> --schema public > db/types.ts`.
  - [ ] **Test Subtask:** Verify `db/types.ts` is generated and contains accurate types for the new tables and their columns.
- [ ] **Test Task: Validate Type-Safety (AC: 5)**
  - [ ] Write a simple test or create a temporary script to demonstrate type-safe access to one of the new tables using the generated types.

## Dev Notes

### Context and Summary

This story focuses on defining the initial Supabase database schema and generating corresponding TypeScript types. It is crucial for enabling type-safe interaction with the database, which is a core tenet of our chosen technology stack (Next.js with TypeScript). This aligns directly with the "Data Persistence" decision in the Architecture document and is a prerequisite for any data-driven features.

### Project Structure Notes

This story will involve creating or updating files within the `db/` directory, specifically `db/schema.ts` for schema definition and `db/types.ts` for generated TypeScript types. The naming conventions for tables (`snake_case` plural) and columns (`snake_case`) as defined in the Architecture document's "Implementation Patterns" must be strictly adhered to. Changes to the database schema will require `supabase gen types typescript` to keep `database.types.ts` updated.

### References

*   **Tech Spec:** `docs/tech-spec-epic-1.md#Detailed-Design` (Data Models and Contracts)
*   **PRD:** `docs/PRD.md` (General project requirements)
*   **Architecture:** `docs/architecture.md#Decision-Summary` (Data Persistence: Supabase)
*   **Architecture:** `docs/architecture.md#Data-Architecture` (Core Models)
*   **Architecture:** `docs/architecture.md#Security-Architecture` (RLS)
*   **Architecture:** `docs/architecture.md#Implementation-Patterns` (Naming Patterns for DB tables/columns)
*   **Epic Definition:** `docs/epics.md#Epic-1:-Project-Foundation` (Goal and Scope for Epic 1)
*   **Epic Definition:** `docs/epics.md#Story-1.2:-Database-Schema-&-Type-Generation` (Specific story details)

## Dev Agent Record

### Context Reference

*   **Story Context:** `docs/sprint-artifacts/1-2-database-schema-type-generation.context.xml`

### Agent Model Used

gemini-1.5-flash

### Debug Log References

### Completion Notes List

### File List

## Change Log

- [{{date}}] Created story draft.
- [{{date}}] Updated story to address validation issues: Added Tech Spec citation, added testing subtasks, and initialized Change Log.
- [lørdag 29. november 2025] Story marked ready-for-dev. Context generated.
