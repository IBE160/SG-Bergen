# Architecture

## Executive Summary

"Digital Guess Who" is a real-time, multiplayer web application reimagining the classic board game. The architecture prioritizes simplicity, stability, and developer experience by leveraging a proven **Next.js (App Router)** + **Supabase** stack. It utilizes **Supabase Realtime** for low-latency game state synchronization (<500ms) and **Zustand** for clean, decoupled client-side state management. The project is structured using a **feature-sliced** organization to enhance maintainability and scalability, ensuring a robust foundation for the MVP and future extensibility.

## Project Initialization

The project will be initialized using the official Vercel Next.js + Supabase starter template, which provides a production-ready foundation with pre-configured Authentication, Database, and Tailwind CSS.

**First Implementation Step:**
Execute the following command to scaffold the project:
```bash
npx create-next-app -e with-supabase digital-guess-who
```

**This starter provides:**
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript (Strict mode)
*   **Database & Auth:** Supabase (Client & Server config)
*   **Styling:** Tailwind CSS
*   **Linting:** ESLint & Prettier configuration

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Project Foundation** | **Vercel Next.js + Supabase Starter** | Latest (Next.js 15+, Supabase JS v2+) | All | Accelerates setup with best-practice configurations for Auth, DB, and Styling. Reduces boilerplate. |
| **Real-time Engine** | **Supabase Realtime** | Native to Supabase | Core Gameplay Loop | Built-in "Broadcast" feature provides <100ms latency perfect for turn-based mechanics without managing a separate WebSocket server. |
| **State Management** | **Zustand** | Latest (v4/v5) | Game Session, Gameplay | Simplifies complex game logic (turns, elimination) compared to Context API. Decouples logic from UI components for better testability. |
| **Data Persistence** | **Supabase (PostgreSQL)** | Managed Service | Game Session, Foundation | Relational data model is ideal for structured game data (users, sessions, moves). |
| **Styling** | **Tailwind CSS** | v4.x | All UI Epics | Rapid UI development, consistent with `shadcn/ui` component library. |
| **Component Library** | **shadcn/ui** | Latest | All UI Epics | Provides accessible, customizable foundation components (Buttons, Dialogs) that integrate perfectly with Tailwind. |
| **Hosting** | **Vercel** | Managed Service | All | Native optimization for Next.js, zero-config deployment, and seamless integration with Supabase. |

## Project Structure

```
./
├── node_modules/                      # Dependencies
├── public/                            # Static assets
│   ├── assets/
│   │   ├── images/                    # Character portraits, backgrounds
│   │   └── icons/                     # UI icons
├── app/                               # Application Source (Feature-Sliced)
│   ├── (auth)/                        # Authentication routes
│   │   └── login/
│   │       └── page.tsx               # Login page
│   ├── game-lobby/                    # Feature: Game Setup & Lobby
│   │   ├── components/                # Lobby-specific components
│   │   │   └── GameRoomCard.tsx
│   │   └── page.tsx                   # Lobby entry point
│   ├── game-play/                     # Feature: Core Gameplay
│   │   ├── components/                # Gameplay-specific components
│   │   │   ├── CharacterGrid.tsx      # The board
│   │   │   └── CharacterCard.tsx      # Individual card
│   │   └── page.tsx                   # Game room entry point
│   ├── api/                           # Backend API Routes
│   │   ├── game/[game-id]/route.ts    # Game actions API
│   │   └── auth/route.ts              # Auth callbacks
│   ├── globals.css                    # Global styles (Tailwind)
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Landing page
├── components/                        # Shared Components
│   ├── ui/                            # shadcn/ui primitives
│   │   └── button.tsx
│   └── layout/                        # Structural components (Header, Footer)
├── lib/                               # Shared Utilities & Services
│   ├── utils.ts                       # Helper functions (cn, dates)
│   └── supabase/                      # Supabase configuration
│       ├── client.ts                  # Client-side instance
│       └── server.ts                  # Server-side instance (if needed)
├── db/                                # Database Definition
│   ├── schema.ts                      # Schema definitions
│   └── types.ts                       # Generated TS types
├── hooks/                             # Shared React Hooks
├── styles/                            # Style configurations
├── .env.local                         # Environment secrets
├── next.config.js                     # Next.js config
├── package.json                       # Dependencies & Scripts
├── tsconfig.json                      # TypeScript config
├── tailwind.config.ts                 # Tailwind config
└── README.md                          # Project documentation
```

## Epic to Architecture Mapping

| Epic | Primary Architecture Components | Key Files/Directories |
| :--- | :--- | :--- |
| **Epic 1: Project Foundation** | Next.js Config, Tailwind, Global Layouts | `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts` |
| **Epic 2: Game Session Management** | Supabase Client, Zustand Store (Lobby), API Routes | `app/game-lobby/`, `lib/supabase/`, `app/api/game/` |
| **Epic 3: Core Gameplay Loop** | Supabase Realtime, Zustand Store (Game), Feature Components | `app/game-play/`, `app/game-play/components/`, `db/schema.ts` |
| **Epic 4: Post-Game Experience** | Gameplay UI State, Navigation Logic | `app/game-play/` (Game Over View), `components/ui/` |

## Technology Stack Details

### Core Technologies
*   **Frontend Framework:** Next.js 15+ (App Router)
*   **Language:** TypeScript 5.x
*   **Database:** PostgreSQL (via Supabase)
*   **Authentication:** Supabase Auth
*   **Styling:** Tailwind CSS 4.x
*   **State Management:** Zustand (Client), Supabase Realtime (Server Sync)
*   **UI Library:** shadcn/ui (Radix UI + Tailwind)

### Integration Points
1.  **Client <=> Supabase:** Direct interaction via `@supabase/supabase-js` for Realtime subscriptions and standard CRUD operations where security rules (RLS) allow.
2.  **Next.js API <=> Supabase:** Server-side interaction for privileged operations (e.g., creating a protected game session) using service role keys if necessary.
3.  **Client <=> Next.js API:** Standard `fetch` calls for server-side logic that shouldn't be exposed directly to the client.

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents and developers:

### 1. Naming Patterns
*   **Files & Folders:** `kebab-case` (e.g., `user-profile.tsx`, `game-session.ts`)
*   **React Components:** `PascalCase` (e.g., `UserProfile`, `CharacterCard`)
*   **Functions & Variables:** `camelCase` (e.g., `fetchUserData`, `isLoading`)
*   **Database Tables:** `snake_case` (plural) (e.g., `game_sessions`, `players`)
*   **Database Columns:** `snake_case` (e.g., `created_at`, `user_id`)
*   **Environment Variables:** `SCREAMING_SNAKE_CASE` (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
*   **API Routes:** `kebab-case` resource names (e.g., `/api/games/[id]/join`)

### 2. Structure Patterns
*   **Feature-Sliced Design:** Code is organized by feature (`game-lobby`, `game-play`) rather than type (`components`, `hooks`).
*   **Shared UI:** Generic UI components live in `components/ui`.
*   **Business Logic:** Complex game logic resides in Zustand stores or `lib/game-logic.ts`, not inside UI components.

### 3. Format Patterns
*   **API Responses:** Standardized JSON envelope:
    *   Success: `{ "data": { ...result } }`
    *   Error: `{ "error": { "message": "...", "code": "..." } }`
*   **Dates:** ISO 8601 strings for all data exchange (`YYYY-MM-DDTHH:mm:ss.sssZ`).

### 4. Communication Patterns (Supabase Realtime)
*   **Channel Naming:** `game:[game-id]` (e.g., `game:1234-5678`)
*   **Event Names:**
    *   `player-joined`: A new user entered the lobby.
    *   `game-started`: Host initiated the game.
    *   `turn-changed`: Active player ended their turn.
    *   `card-flipped`: A character was eliminated.
    *   `game-over`: Win/Loss condition met.
*   **State Sync:** Events payload includes the *delta* or the *new critical state* to ensure eventual consistency.

### 5. Lifecycle Patterns
*   **Loading States:** UI must show skeleton loaders or spinners during async operations. Interaction elements must be disabled.
*   **Error Boundaries:** Pages should not crash entirely; use React Error Boundaries to show friendly "Something went wrong" UI.
*   **Cleanup:** `useEffect` hooks subscribing to Realtime channels must return a cleanup function to unsubscribe (`channel.unsubscribe()`).

### 6. Location Patterns
*   **Routes:**
    *   `/` -> Home
    *   `/lobby` -> Game Creation/Joining
    *   `/game/[code]` -> Active Game Room
*   **Assets:** All static images in `public/assets/`.

## Consistency Rules

### Consistency Patterns
*   **User-Facing Dates:** Display dates in human-readable format (e.g., "Nov 29, 2025", "Just now") using a utility function.
*   **Logging:** Use structured logging for critical game events.
    *   Format: `[Level] [Context] Message { metadata }`
    *   Example: `[INFO] [GameEngine] Player flipped card { cardId: 5, gameId: "xyz" }`
*   **Error Messages:** User-facing errors must be non-technical and actionable.
    *   Bad: "404 Resource Not Found"
    *   Good: "We couldn't find that game. Please check the code."

## Data Architecture

### Core Models
*   **User:** `id` (UUID), `username`, `avatar_url`
*   **GameSession:** `id` (UUID), `code` (String), `status` (waiting/active/finished), `host_id` (UUID), `winner_id` (UUID, nullable), `created_at`
*   **Player:** `id` (UUID), `user_id` (UUID), `game_id` (UUID), `character_id` (Int, secret), `is_ready` (Bool)
*   **Move:** `id`, `game_id`, `player_id`, `action_type` (question/guess/flip), `details` (JSON), `created_at`

## Security Architecture

*   **Authentication:** Supabase Auth (Email/Password or Social).
*   **Authorization (Row Level Security - RLS):**
    *   **Strict Default:** All tables have RLS enabled. "Enable all" policies are forbidden.
    *   **Users Table:**
        *   `SELECT`: Public (Authenticated) for basic profile info (username, avatar).
        *   `UPDATE`: Restricted to `auth.uid() = id` (Self-service only).
    *   **Game Sessions Table:**
        *   `SELECT`: Public (Authenticated) to allow joining.
        *   `INSERT`: Authenticated users only.
        *   `UPDATE/DELETE`: Restricted to Host only (`auth.uid() = host_id`).
    *   **Players Table (Sensitive):**
        *   `SELECT`: Restricted to authenticated users (for MVP lobby visibility). *Planned upgrade for Epic 3: Restrict `character_id` visibility via a separate view.*
        *   `INSERT`: Users can only add *themselves* as players (`auth.uid() = user_id`).
        *   `UPDATE`: Users can only update their own status (`is_ready`).
*   **Data Integrity & Anti-Cheating:**
    *   **Uniqueness:** `game_sessions.code` has a strict unique constraint in the database.
    *   **Atomic Cleanup:** API routes implement cleanup logic to delete orphaned game sessions if player creation fails.
    *   **Server-Side Verification (Epic 3):** Winning guesses are verified on the server; the opponent's secret `character_id` is NEVER sent to the client to prevent inspection cheating.
*   **Secrets:** API keys managed via `.env.local` and Vercel Environment Variables. Never committed to Git.

## Performance Considerations

*   **Latency:** Supabase Realtime "Broadcast" mode used for transient game events (cursor, flips) to bypass database writes where persistence isn't critical for speed.
*   **Optimistic UI:** Zustand updates local state *immediately* on user action, then reconciles with server state to make the game feel instant.

## Deployment Architecture

*   **Platform:** Vercel (Serverless).
*   **Database:** Supabase (Managed PostgreSQL).
*   **CI/CD:** Automatic deployments via Vercel upon push to `main` branch.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: lørdag 29. november 2025_
_For: BIP_