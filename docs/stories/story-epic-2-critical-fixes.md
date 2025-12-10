---
id: "STORY-EPIC-2-FIXES"
title: "Critical Fixes & Preparation for Epic 3"
status: "Approved"
priority: "High"
estimation: "36h"
assigned_to: "dev"
---

# User Story
As the development team,
I want to address the critical technical debt and preparation items identified in the Epic 2 Retrospective,
So that the codebase is stable, secure, and ready for the implementation of the Core Gameplay Loop in Epic 3.

# Acceptance Criteria

## AC1: Data Integrity in Game Creation
- [x] Implement atomic transaction or cleanup logic in `digital-guess-who/app/api/game/create/route.ts`.
- [x] Ensure that if player insertion fails, the game session is also rolled back/deleted.
- [x] Verify no orphaned game sessions are created upon partial failure.

## AC2: Game Code Uniqueness Constraint
- [x] Create a database migration to add a UNIQUE constraint to `game_sessions.code`.
- [x] Verify the constraint prevents duplicate game codes.
- [x] Ensure the game creation logic handles potential uniqueness violations (e.g., retry logic or error handling), although the constraint is the primary AC here.

## AC3: Real-time Turn Management Testing Strategy
- [x] Create a markdown document `docs/testing/real-time-turn-strategy.md`.
- [x] Define the strategy for testing real-time turn management (syncing state, turn validation).
- [x] Include details on tools/libraries to be used (e.g., Jest, specialized mocks).

## AC4: Secure Secret Character Selection Design
- [x] Create a design document `docs/design/secret-character-selection.md`.
- [x] Detail a secure method for assigning and storing secret characters so they are NOT exposed to the client until necessary (or never, if only verified server-side).
- [x] Ensure the design prevents simple inspection of network traffic or local state to reveal opponent's character.

## AC5: RLS Policy Verification
- [x] Review existing RLS policies for `public.players` and `public.users` tables in Supabase.
- [x] Verify they correctly restrict access (e.g., players can only see their own secret data, but public data is visible).
- [x] Document findings or apply fixes if policies are too permissive or restrictive.
- [x] Create a verification report or update `docs/security/rls-audit.md`.

# Technical Notes
- Reference: `docs/sprint-artifacts/epic-2-retro-onsdag 10. desember 2025.md`
- Codebase: `digital-guess-who/`
