# Backend Architecture

## Overview
The backend is built on a serverless architecture using **Supabase** (BaaS) and **Next.js API Routes**. This minimizes operational overhead while providing robust real-time capabilities essential for the game.

## Core Services

### 1. Database (PostgreSQL)
*   **Role:** Primary source of truth.
*   **Access:** Accessed via Supabase Client (`@supabase/supabase-js`).
*   **Security:** Row Level Security (RLS) policies enforce data isolation.
    *   *Public:* Game definitions (read-only).
    *   *Authenticated:* Creating games, joining games.
    *   *Owner:* Updating own player state.

### 2. Authentication
*   **Service:** Supabase Auth.
*   **Flow:** handled via `@supabase/ssr` to ensure secure cookie handling and session validation on both client and server.

### 3. Realtime Engine
*   **Service:** Supabase Realtime (Postgres Changes & Broadcast).
*   **Pattern:** "Broadcast" channels are used for high-frequency, ephemeral events (e.g., cursor movements, card flips) to reduce DB write load.
*   **Persistence:** Critical state changes (e.g., "Game Won", "Turn Ended") are written to DB, which then triggers Realtime updates to clients.

### 4. API Routes (Next.js)
*   **Location:** `app/api/`
*   **Use Case:**
    *   Complex validation logic that RLS cannot handle easily.
    *   Admin tasks.
    *   Orchestration involving multiple tables if transaction safety is required.

## API Structure

```
/api
  /game
    /create        [POST] - Initialize new game
    /[id]/join     [POST] - Join existing game
    /[id]/state    [GET]  - Fetch full game state
  /auth
    /callback      [GET]  - Handle OAuth redirects
```
