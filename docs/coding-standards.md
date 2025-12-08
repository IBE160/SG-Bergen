# Coding Standards

## Naming Conventions

- **Files & Directories:** `kebab-case` (e.g., `user-profile.tsx`, `game-lobby/`)
- **React Components:** `PascalCase` (e.g., `UserProfile`, `GameCard`)
- **Functions & Variables:** `camelCase` (e.g., `fetchUserData`, `isLoading`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_PLAYERS`, `DEFAULT_TIMEOUT`)
- **Database Tables:** `snake_case` (plural) (e.g., `game_sessions`, `players`)
- **Database Columns:** `snake_case` (e.g., `created_at`, `user_id`)
- **Types/Interfaces:** `PascalCase` (e.g., `Player`, `GameState`)

## Project Structure (Feature-Sliced)

- Organize code by **Feature** rather than **Type**.
- Example: `app/game-lobby/` contains its own components, hooks, and utils if they are specific to that feature.
- Shared logic goes into `components/ui` (generic UI) or `lib/` (business logic/services).

## formatting & Style

- **Strict Mode:** TypeScript `strict: true` must be enabled.
- **No `any`:** Avoid `any` type; use explicit types or Generics.
- **Async/Await:** Prefer `async/await` over `.then()`.
- **Early Returns:** Use early returns to reduce nesting indentation.
- **Functional Components:** Use React Functional Components (`const Component = () => {}`) over Class components.

## Comments & Documentation

- **Why vs What:** Comments should explain *why* complex logic exists, not *what* the code is doing (code should be self-documenting).
- **JSDoc:** Use JSDoc for shared utility functions and complex interfaces.

## Error Handling

- **User-Facing:** Display friendly error messages (Toast/Alert) rather than crashing the app.
- **Logging:** Log errors to console in development; suppress sensitive info in production.
- **Boundaries:** Use React Error Boundaries for page-level protection.
