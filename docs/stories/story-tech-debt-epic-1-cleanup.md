# User Story: Epic 1 Technical Debt Cleanup

**Status:** Approved
**Priority:** High
**Effort:** 3 pts

## Description
Address critical technical debt items identified in the Epic 1 Retrospective to ensure a stable foundation for Epic 2. This involves fixing test configuration, resolving module resolution issues in tests, and improving the Supabase type generation workflow.

## Acceptance Criteria
1.  **AC1:** `jest.config.ts` is updated to use `testEnvironment: 'jsdom'` for correct React component testing. [x]
2.  **AC2:** Module resolution issues in `game-store.test.ts` (and any other affected tests) are resolved. [x]
3.  **AC3:** All previously excluded tests (specifically `game-store.test.ts` and `turn-manager.test.ts`) are enabled and passing 100%. [x]
4.  **AC4:** An automated method for generating Supabase types (`supabase gen types typescript`) is established and verified to work via a script in `package.json`. [x]

## Tasks
- [x] Update `jest.config.ts` environment setting.
- [x] Investigate and fix module resolution errors in `tests/unit/game-store.test.ts`.
- [x] Re-enable `tests/unit/game-store.test.ts` and `tests/unit/turn-manager.test.ts`.
- [x] Run all tests and fix any resulting failures from the environment change or re-enabling.
- [x] Add `supabase:generate-types` script to `package.json` and verify its execution.
