# Testing Strategy

## Overview
This project uses a layered testing approach to ensure reliability without slowing down velocity. We prioritize unit testing for business logic and manual verification for UI flows in the MVP phase, transitioning to automated integration tests for critical paths.

## 1. Unit Testing (Automated)
*   **Tools:** Jest, `ts-jest`
*   **Scope:**
    *   Shared utility functions (`lib/utils.ts`)
    *   Game logic helpers
    *   Zustand store logic (state transitions)
*   **Standard:** High coverage for pure functions and state manipulations.

## 2. Component Testing (Planned)
*   **Tools:** Jest + React Testing Library (JSDOM Environment)
*   **Scope:**
    *   Reusable UI components (`components/ui`)
    *   Form validation logic
    *   Interactive components (Game Board, Cards)
*   **Note:** Requires `jest.config.ts` environment update to `jsdom`.

## 3. Integration Testing (Manual & API)
*   **Tools:** Manual verification, Postman (optional)
*   **Scope:**
    *   Full game flows (Create -> Join -> Play)
    *   Supabase Realtime events (Tab syncing)
    *   Authentication flows
*   **Standard:** All User Stories must pass manual verification of Acceptance Criteria before completion.

## 4. End-to-End (E2E) Testing (Future)
*   **Tools:** Playwright (Recommended for Post-MVP)
*   **Scope:** Critical user journeys running against a staging environment.

## Running Tests
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch
```
