# Project Backlog

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2025-11-29 | 1.1 | 1 | Documentation | Low | TBD | Open | Update README.md to reflect Digital Guess Who project details. |
| 2025-11-29 | 1.1 | 1 | TechDebt | Low | TBD | Open | Pin next dependency version in package.json to avoid 'latest'. |
| 2025-11-29 | N/A | 2/3 | Security | High | TBD | Open | **Harden RLS Policies:** Transition from permissive `using (true)` to strict policies checking `user_id` and `game_id` ownership. |
| 2025-12-01 | 2.3 | 2 | TechDebt | Low | TBD | Open | Refine Player type definition in store.ts to avoid unknown as casts. [file: digital-guess-who/app/game-lobby/store.ts:5] |
| 2025-12-01 | 2.3 | 2 | Bug | Low | TBD | Open | Replace console.error with production-grade logging solution. [file: digital-guess-who/app/game-lobby/[code]/page.tsx:46] |
| 2025-12-01 | 2.3 | 2 | Test | Low | TBD | Open | Add unit test case for LobbyStore to simulate both players ready state. [file: digital-guess-who/__tests__/game-lobby/store.test.ts] |
| 2025-12-01 | 2.3 | 2 | Test | Low | TBD | Open | Implement E2E tests for real-time interactions and auto-start navigation. |
