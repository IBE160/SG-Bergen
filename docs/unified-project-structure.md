# Unified Project Structure

This document outlines the standard directory structure and naming conventions for the `digital-guess-who` application. Adhering to this structure ensures consistency, modularity, and maintainability across the project.

## 1. Root Level (`digital-guess-who/`)

The root of the `digital-guess-who` application contains core configuration and top-level directories:

-   `app/`: The primary directory for Next.js App Router pages, layouts, and API routes.
-   `components/`: Contains reusable React components.
-   `db/`: Houses database schema definitions and generated types.
-   `lib/`: Stores utility functions, helper modules, and integrations with external services (e.g., Supabase).
-   `public/`: Static assets (images, fonts, etc.).
-   `node_modules/`: Installed npm packages.
-   `package.json`, `package-lock.json`: Project dependencies and scripts.
-   `next.config.ts`: Next.js configuration.
-   `tsconfig.json`: TypeScript configuration.
-   `tailwind.config.ts`, `postcss.config.mjs`: Tailwind CSS and PostCSS configuration.
-   `eslint.config.mjs`: ESLint configuration.
-   `jest.config.ts`: Jest testing framework configuration.
-   `.gitignore`: Git ignore rules.
-   `README.md`: Project overview and setup instructions.

## 2. `app/` Directory (Next.js App Router)

This directory follows Next.js App Router conventions and is organized by features or route groups:

-   `(auth)/`: A route group (denoted by parentheses) for authentication-related pages (e.g., `login`, `sign-up`, `forgot-password`). Routes within this group do not affect the URL path.
    -   `login/page.tsx`: Login page.
    -   `sign-up/page.tsx`: Sign-up page.
    -   `forgot-password/page.tsx`: Forgot password page.
-   `auth/`: Contains API routes or other server-side logic related to authentication callbacks.
    -   `callback/route.ts`: API route for OAuth/Magic Link callbacks.
-   `protected/`: Pages that require user authentication to access.
-   `ui-test/`: Dedicated pages for testing and showcasing UI components during development.
    -   `page.tsx`: UI test page.
-   `game-lobby/`: Feature-sliced directory for game lobby related pages and API routes.
    -   `create/page.tsx`: Page for creating a new game.
    -   `[code]/page.tsx`: Dynamic route for a specific game lobby.
    -   `api/game/create/route.ts`: API route for game creation.
-   `favicon.ico`: Favicon for the application.
-   `globals.css`: Global CSS styles.
-   `layout.tsx`: The root layout for the application.
-   `page.tsx`: The root page for the application.
-   `opengraph-image.png`, `twitter-image.png`: Social media preview images.

## 3. `components/` Directory

This directory is for reusable UI components, categorized by their domain or purpose:

-   `auth/`: Components specific to authentication (e.g., `login-form.tsx`, `sign-up-form.tsx`).
-   `ui/`: Contains UI primitives from `shadcn/ui` (e.g., `button.tsx`, `input.tsx`, `card.tsx`).
-   `tutorial/`: Components related to tutorial features.
-   Other standalone components: Components that are reusable but don't fit into a specific domain subdirectory (e.g., `auth-button.tsx`, `logout-button.tsx`, `theme-switcher.tsx`).

## 4. `db/` Directory

-   `schema.ts`: Defines the Supabase database schema, including table structures, relationships, and constraints.
-   `types.ts`: Contains automatically generated TypeScript types based on the `schema.ts`, used for strong typing database interactions.

## 5. `lib/` Directory

This directory contains utility functions and integrations:

-   `supabase/`: Supabase client and server-side utilities.
    -   `client.ts`: Supabase client for browser-side interactions.
    -   `server.ts`: Supabase client for server-side (Next.js server components/API routes) interactions.
-   `utils.ts`: General-purpose utility functions used across the application.

## 6. Naming Conventions

-   **Files and Folders:** Use `kebab-case` (e.g., `game-lobby`, `auth-button.tsx`).
-   **React Components:** Use `PascalCase` for component file names and component names within the files (e.g., `AuthButton.tsx`, `LoginForm.tsx`).
-   **API Routes:** Use `kebab-case` for route segments and `route.ts` for the file name (e.g., `app/api/game/create/route.ts`).
-   **TypeScript Interfaces/Types:** Use `PascalCase` (e.g., `GameSession`, `Player`).

By following these guidelines, we aim to maintain a clear, scalable, and easy-to-navigate project structure.
