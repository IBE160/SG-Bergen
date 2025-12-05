# Story 1.2: Database Schema & Type Generation

Status: drafted

## Story

As a developer,
I want to define the initial Supabase database schema and generate TypeScript types,
So that we can interact with the database using type-safe methods.

## Acceptance Criteria

1. **Given** The Supabase project is active
   **When** I run the SQL migration script defined in Architecture
   **Then** Tables for `users`, `game_sessions`, `players`, and `moves` are created in the public schema
2. **And** I can run `supabase gen types typescript` to generate `database.types.ts`
3. **And** The generated types accurately reflect the schema (e.g., `game_sessions` has `code`, `status`, `host_id`)

## Tasks / Subtasks

- [ ] Define the initial Supabase database schema in `db/schema.ts` for `users`, `game_sessions`, `players`, and `moves` tables. (AC: 1)
  - [ ] Implement `game_sessions` table with `id` (UUID), `code` (text), `status` (enum), `host_id` (UUID), `winner_id` (UUID, nullable), `created_at` (timestamp).
  - [ ] Implement `players` table with `id` (UUID), `user_id` (UUID), `game_id` (UUID), `character_id` (integer), `is_ready` (boolean).
  - [ ] Implement `moves` table with `id` (UUID), `game_id` (UUID), `player_id` (UUID), `action_type` (enum), `details` (JSONB), `created_at` (timestamp).
  - [ ] Implement `users` table with `id` (UUID), `username` (text), `avatar_url` (text).
- [ ] Run `supabase gen types typescript` to generate `database.types.ts`. (AC: 2)
- [ ] Verify that `database.types.ts` accurately reflects the created schema. (AC: 3)
  - [ ] Check `game_sessions` type for `code`, `status`, `host_id`.
  - [ ] Check `players` type for `game_id`, `user_id`, `character_id`, `is_ready`.
  - [ ] Check `moves` type for `game_id`, `player_id`, `action_type`, `details`.
  - [ ] Check `users` type for `username`, `avatar_url`.
- [ ] Enable RLS (Row Level Security) on new tables, initially permissive for MVP.

## Dev Notes

- **Relevant architecture patterns and constraints:**
  - Supabase (PostgreSQL) is the chosen database for relational data.
  - Type generation is critical for type-safe interactions.
  - RLS needs to be enabled, but policies can be permissive for MVP.
- **Source tree components to touch:**
  - `db/schema.ts`: New file for schema definition.
  - `db/types.ts`: Generated file for TypeScript types.
  - Supabase CLI for type generation.
- **Testing standards summary:**
  - Basic unit tests/integration tests to verify generated types match schema.
  - Basic CRUD operations against mock Supabase client or a test database.

### Project Structure Notes

- **Alignment with unified project structure (paths, modules, naming):**
  - Schema definition will reside in `db/schema.ts` as per architectural guidelines.
  - Generated types will be in `db/types.ts`.

### References

- [Source: docs/PRD.md#Implementation-Planning] - High-level functional requirements.
- [Source: docs/architecture.md#Data-Persistence] - Decision to use Supabase (PostgreSQL).
- [Source: docs/architecture.md#Detailed-Design] - Data Models and Contracts, Database Schema.
- [Source: docs/epics.md#Story-1.2-Database-Schema-&-Type-Generation] - Original story statement and acceptance criteria.
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Detailed-Design] - Further details on data models and contracts.
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Acceptance-Criteria-(Authoritative)] - Authoritative acceptance criteria for this story.
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Risks,-Assumptions,-Open-Questions] - Mentions initial schema DDL.

### Learnings from Previous Story

**From Story 1.1: Project Scaffolding & Vercel Deployment (Status: done)**

- **Project Setup:** Project successfully initialized using `create-next-app` with Supabase template and deployed to Vercel.
- **Environment Variables:** Corrected environment variable usage from `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `client.ts` and `server.ts` to align with project standards. This was a critical fix.
- **File Clean-up:** Duplicate entries in `.gitignore` were removed.
- **Key Files Modified in Previous Story:** The core Supabase client and server initialization files (`digital-guess-who/lib/supabase/client.ts`, `digital-guess-who/lib/supabase/server.ts`) were modified to reflect corrected environment variable usage.

[Source: stories/1-1-project-scaffolding-vercel-deployment.md#Completion-Notes-List]
[Source: stories/1-1-project-scaffolding-vercel-deployment.md#Senior-Developer-Review-(AI)]

## Dev Agent Record

### Context Reference

### Agent Model Used

gemini-1.5-flash

### Debug Log References

### Completion Notes List

### File List
