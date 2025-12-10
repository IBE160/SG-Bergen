# RLS Security Audit & Plan

**Date:** onsdag 10. desember 2025
**Scope:** `public.players`, `public.users`, `public.game_sessions`

## Findings

### 1. Current State: "Open to World"
The `db/schema.ts` currently defines:
```sql
create policy "Enable all access for all users" on public.players for all using (true) with check (true);
```
**Risk Level: CRITICAL**
*   **Impact:** Any authenticated user can query `SELECT * FROM players` and see every game's participants and, crucially, their `character_id` (once Epic 3 implements it).
*   **Cheating:** This allows trivial cheating by inspecting the network traffic or querying Supabase directly.

### 2. `public.users`
*   **Current:** All access.
*   **Risk:** Low/Medium. Emails might be exposed if they are in the table (Schema says `email text`).
*   **Recommendation:**
    *   `SELECT`: Public (Authenticated) - Needed for avatars/usernames.
    *   `UPDATE`: `auth.uid() = id` (Self only).
    *   `INSERT`: Trigger-based (already implemented) or Service Role only.

### 3. `public.game_sessions`
*   **Current:** All access.
*   **Risk:** Medium. Players could mess with other games.
*   **Recommendation:**
    *   `SELECT`: Public (Authenticated) - Needed for joining.
    *   `INSERT`: Public (Authenticated).
    *   `UPDATE`: `host_id = auth.uid()` (Host only).

## Remediation Plan (Immediate Actions)

We will apply the following policies via a new migration:

### A. Users Table
```sql
DROP POLICY "Enable all access for all users" ON public.users;
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
```

### B. Game Sessions
```sql
DROP POLICY "Enable all access for all users" ON public.game_sessions;
CREATE POLICY "Games are viewable by everyone" ON public.game_sessions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create games" ON public.game_sessions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Hosts can update their games" ON public.game_sessions FOR UPDATE USING (auth.uid() = host_id);
```

### C. Players Table (The Sensitive One)
This requires a structural change to be safe (Column-Level Security via View).
**Proposed Migration Step 1 (Lockdown):**
```sql
DROP POLICY "Enable all access for all users" ON public.players;
-- Allow seeing WHO is in the game (required for Lobby), but this exposes character_id.
-- TEMPORARY COMPROMISE for Epic 2 compatibility:
CREATE POLICY "View players in same game" ON public.players FOR SELECT 
USING (auth.uid() IN (
    SELECT user_id FROM public.players as p2 WHERE p2.game_id = game_id
));
```
**Step 2 (Epic 3 Implementation):**
*   Create View `public.player_public_info`.
*   Revoke SELECT on `players` for common roles.
*   Grant SELECT on `players` ONLY to owner.

## Conclusion
The current "Enable all" policies must be replaced. A migration `20251210121000_fix_rls_policies.sql` will be created to apply the basic restrictions for Users and Games, and a "Same Game" restriction for Players.
