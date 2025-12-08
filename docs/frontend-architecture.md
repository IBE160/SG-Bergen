# Frontend Architecture

## Overview
The frontend is a **Next.js 15+** application using the **App Router**. It emphasizes a **Feature-Sliced Design** to keep related logic collocated, and uses **Zustand** for efficient, decoupled state management.

## Project Structure (Feature-Sliced)

We organize code by *domain feature* rather than technology type:

```
app/
  (auth)/          # Auth feature
  game-lobby/      # Lobby feature
  game-play/       # Gameplay feature
  layout.tsx       # Root layout
```

## State Management Strategy

### 1. Server State (Data Fetching)
*   **Mechanism:** React Server Components (RSC).
*   **Usage:** Initial page loads (e.g., fetching User Profile, Game Details).
*   **Benefit:** Reduces client bundle size and improves SEO/LCP.

### 2. Global Client State (Zustand)
*   **Mechanism:** `zustand` stores.
*   **Usage:**
    *   `useGameStore`: Manages active game state (cards, turn, players).
    *   `useLobbyStore`: Manages waiting room state.
*   **Rationale:** Simpler than Redux, easier to test, and avoids "Context Hell".

### 3. Local UI State
*   **Mechanism:** `useState`, `useReducer`.
*   **Usage:** Form inputs, modal visibility, ephemeral UI interactions.

## Component Architecture

*   **Atomic Design (Loose):**
    *   `components/ui`: Atoms/Molecules (Buttons, Inputs) from **shadcn/ui**.
    *   `feature/components`: Organisms (Game Board, Player List).
*   **Composition:** Prefer composition (children prop) over configuration props for layout components.

## Styling

*   **Framework:** Tailwind CSS.
*   **Theme:** Configured in `tailwind.config.ts`.
*   **Dark Mode:** Supported via `next-themes`.

## Realtime Integration

*   **Pattern:** Custom hooks (e.g., `useGameSubscription`) wrap Supabase subscriptions and dispatch updates to Zustand stores.
*   **Lifecycle:** Subscriptions connect on mount and disconnect on unmount (`useEffect`).
