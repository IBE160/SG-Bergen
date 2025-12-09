# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story’s `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| ---- | ----- | ---- | ---- | -------- | ----- | ------ | ----- |
| 2025-12-06 | 1.2 | 1 | Bug | High | Amelia | Done | Update `digital-guess-who/db/types.ts` to exactly match schema and fix associated tests. |
| 2025-12-08 | 2.1 | 2 | Bug | Medium | Amelia | Done | Fix invalid fetch mocking in UI tests for game lobby. |
| 2025-12-08 | 2.1 | 2 | Tech Debt | Low | TBD | Open | Wrap game/player creation in Supabase RPC to prevent orphaned sessions. |
| 2025-12-08 | 2.1 | 2 | Enhancement | Low | TBD | Open | Add collision check or database constraint for game code uniqueness. |
| tirsdag 9. desember 2025 | 2.3 | 2 | Security | Critical | TBD | Done | Verify Supabase RLS Policies for `public.players` and `public.users` tables to ensure authorization and data access control. |
| tirsdag 9. desember 2025 | 2.3 | 2 | Documentation | Medium | TBD | Open | Create `docs/sprint-artifacts/tech-spec-epic-2.md` to detail architectural blueprint for "Game Session Management" epic. |