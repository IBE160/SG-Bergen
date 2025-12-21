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
| 2025-12-12 | 3.1 | 3 | Bug | High | Amelia | Done | Implement server-side logic (API/Trigger) to transition game to 'playing' (AC #3). |
| 2025-12-12 | 3.1 | 3 | Bug | High | Amelia | Done | Integrate useGameplaySubscription in GameClient to enable realtime updates (AC #3). |
| 2025-12-12 | 3.1 | 3 | Bug | High | Amelia | Done | Implement missing UI/Integration tests for Grid and RLS (AC #1, #2). |
| 2025-12-15 | 3.3 | 3 | Enhancement | Low | Amelia | Done | Add a visual toast/banner prompt "Eliminate Characters" after receiving an answer (AC #5 enhancement). (file: digital-guess-who/app/game-play/[code]/game-client.tsx) |
| 2025-12-21 | 4.3 | 4 | Enhancement | Low | TBD | Open | Add confirmation modal for "Return to Menu" during active games to prevent accidental exits. |
| 2025-12-21 | 4.3 | 4 | UX | Low | TBD | Open | Ensure `sonner` toasts are cleared upon transitioning back to main menu. |