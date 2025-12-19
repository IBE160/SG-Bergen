# Epic 3 Retrospective - fredag 19. desember 2025

## Team Retrospective: Epic 3 - Core Gameplay Loop

**Date:** fredag 19. desember 2025
**Facilitator:** Bob (Scrum Master)
**Participants:**
- Bob (Scrum Master)
- Alice (Product Owner)
- Charlie (Senior Dev)
- Dana (QA Engineer)
- Elena (Junior Dev)
- BIP (Project Lead)

---

## Epic 3 Summary & Metrics

**Epic 3 Title:** Core Gameplay Loop

**Delivery Metrics:**
- Completed: 5/5 stories (100%)
- Velocity: N/A
- Duration: N/A
- Average velocity: N/A

**Quality and Technical:**
- Blockers encountered: Environment memory limits (OOM) during testing (resolved via `--runInBand`).
- Technical debt items: 3 (Race condition in winner display, lack of persistence middleware, missing type definitions).
- Test coverage: High across Unit, UI, and Integration.
- Production incidents: 0

**Business Outcomes:**
- Goals achieved: All core mechanics (Secret Selection, Turn Management, Q&A, Elimination, Guessing) are fully functional.
- Success criteria: Met. The game is now fully playable end-to-end.

---

## What Went Well (Successes & Strengths)

- **Robust Security Architecture:** The implementation of server-authoritative guessing via `/api/game/[gameId]/guess` successfully prevents cheating and protects secret character IDs.
- **Natural Gameplay Flow:** The transition from automatic turn-ending to manual turn-ending (allowing for post-answer elimination) significantly improved the player experience.
- **Clear Visual Feedback:** The `CharacterCard` and `InteractionPanel` provide intuitive state management and accessible UI.
- **Real-time Synchronization:** Supabase Realtime proved highly reliable for turn-based synchronization.

---

## What Didn't Go Well (Challenges & Growth Areas)

- **Testing Infrastructure Constraints:** Persistent "Out of Memory" errors in the test environment hampered automated verification, requiring manual intervention and configuration changes.
- **Logic Iteration:** The server-side trigger for turn management required multiple iterations to correctly handle the new manual turn-ending flow.
- **Race Conditions:** A minor race condition was identified in how the "Victory/Defeat" message is displayed, highlighting a need for optimistic store updates.

---

## Key Insights & Learnings

- **Manual Control vs. Automation:** In gaming UX, giving the player explicit control over turn-ending is often superior to fully automated transitions.
- **Resource Management in Testing:** Large integration tests for real-time apps require sequential execution (`--runInBand`) to manage memory effectively.
- **Security Validation:** Server-side verification is non-negotiable for competitive multiplayer mechanics.

---

## Previous Retrospective Follow-Through Analysis (from Epic 2)

**Critical Path Items for Epic 3:**
1. **Address Game Session Data Integrity:** Completed.
2. **Ensure Game Code Uniqueness:** Completed via database constraints.
3. **Refine Real-time Turn Management Testing Strategy:** Completed (strategy was solid, despite infrastructure limits).
4. **Secure Secret Character Selection Design:** Completed via `player_secrets` table and server-authoritative API.
5. **RLS Policy Verification:** Completed and strictly enforced.

**Success Rate:** 100% of Epic 2's critical prep items were addressed, providing a stable foundation for Epic 3.

---

## Next Epic Preview: Epic 4 - Post-Game Experience

**Goal:** Provide a polished conclusion to the game session and allow players to easily re-engage.

**Dependencies on Epic 3:** High. Relies on the win/loss status and character data generated in Epic 3.

---

## Action Items & Commitments

The team committed to the following action items and preparation tasks before starting Epic 4:

**Technical Debt & Stability (CRITICAL PATH for Epic 4):**

1. **[x] Fix Win/Loss Race Condition:** Update `makeGuess` in `useGameStore` to optimistically set `winnerId` based on the API response.
   - Owner: Charlie (Senior Dev)
   - Priority: High
2. **[x] Implement Zustand Persistence:** Add `persist` middleware to `useGameStore` to ensure board state and game status survive page refreshes.
   - Owner: Elena (Junior Dev)
   - Priority: High
3. **[x] Update Database Types:** Include `player_secrets` table in `db/types.ts` to remove technical debt.
   - Owner: Charlie (Senior Dev)
   - Priority: Medium

**Preparation Tasks for Epic 4:**

1. **Verify `game_sessions` Finalization:** Ensure the database status reliably switches to `finished`.
   - Owner: Charlie (Senior Dev)
2. **Character Reveal UI Check:** Verify character images are correctly displayed on the win/loss screen.
   - Owner: Dana (QA Engineer)

---

## Critical Readiness Assessment

**Epic 3 READINESS ASSESSMENT for Epic 4 Transition:**

- **Testing & Quality:** High. Core logic is well-tested despite environment hurdles.
- **Deployment:** All Epic 3 stories are ready for merge/deployment.
- **Stakeholder Acceptance:** High. BIP (Project Lead) approved the progress.
- **Technical Health:** Good. Critical prep items for Epic 4 are clearly identified.
- **Unresolved Blockers:** None.

**Conclusion:** Epic 3 is fully complete. We are clear to proceed to Epic 4 once the critical path items (Race condition fix and Persistence) are addressed.

---

**Team Performance:**
Epic 3 was the most complex epic to date, and the team handled the technical challenges with maturity. The shift toward server-side authority and manual turn control has resulted in a much more professional and secure application.

---
