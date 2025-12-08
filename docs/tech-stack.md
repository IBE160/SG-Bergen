# Technology Stack

## Core Frameworks & Languages

- **Frontend Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript 5.x (Strict Mode)
- **Styling:** Tailwind CSS 4.x
- **Component Library:** shadcn/ui (Radix UI + Tailwind)

## Backend & Database

- **Database:** PostgreSQL (Managed via Supabase)
- **Authentication:** Supabase Auth (SSR supported)
- **Realtime Engine:** Supabase Realtime (Broadcast & Presence)
- **API Runtime:** Next.js Server Actions / API Routes (Node.js/Edge)

## State Management

- **Client-Side:** Zustand (v4/v5) - Selected for decoupled logic and ease of testing.
- **Server-Sync:** Supabase Realtime (WebSockets) - For game state synchronization.
- **Server-State:** React Server Components (RSC) - For initial data fetching.

## Infrastructure & DevOps

- **Hosting:** Vercel (Production)
- **Source Control:** GitHub
- **Package Manager:** npm
- **Testing:** Jest (Unit/Integration)

## Key Libraries

- **@supabase/supabase-js:** Supabase Client
- **@supabase/ssr:** Server-Side Auth helpers
- **lucide-react:** Iconography
- **clsx / tailwind-merge:** Class name conditional logic
