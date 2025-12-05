# Epic Technical Specification: Project Scaffolding and Core Setup

Date: 2025-12-05
Author: BIP
Epic ID: epic-1
Status: Draft

---

## Overview

{{overview}}

## Objectives and Scope

{{objectives_scope}}

## System Architecture Alignment

{{system_arch_alignment}}

## Detailed Design

### Services and Modules

{{services_modules}}

### Data Models and Contracts

{{data_models}}

### APIs and Interfaces

{{apis_interfaces}}

### Workflows and Sequencing

{{workflows_sequencing}}

## Non-Functional Requirements

### Performance

{{nfr_performance}}

### Security

{{nfr_security}}

### Reliability/Availability

{{nfr_reliability}}

### Observability

{{nfr_observability}}

## Dependencies and Integrations

## Dependencies and Integrations

*   **Frontend Framework:** Next.js 15+ (App Router)
*   **Language:** TypeScript 5.x
*   **Database:** PostgreSQL (via Supabase)
*   **Authentication:** Supabase Auth
*   **Styling:** Tailwind CSS 4.x
*   **State Management:** Zustand (Client), Supabase Realtime (Server Sync)
*   **UI Library:** shadcn/ui (Radix UI + Tailwind)
*   **Hosting:** Vercel


## Acceptance Criteria (Authoritative)

## Acceptance Criteria (Authoritative)

1.  **Project Scaffolding & Vercel Deployment:**
    *   A new Next.js 15+ (App Router) project is created with TypeScript and connected to a Vercel project.
    *   A successful build is deployed to a production URL.
    *   The repository is pushed to GitHub.
2.  **Database Schema & Type Generation:**
    *   Tables for `users`, `game_sessions`, `players`, and `moves` are created in the public schema of Supabase.
    *   TypeScript types (`database.types.ts`) are generated, accurately reflecting the schema.
3.  **UI Library & Global Styles Setup:**
    *   The color palette from UX Spec is available as Tailwind utility classes.
    *   A basic `Button` component from `@/components/ui/button` can be imported and used.
    *   The global font is set to `Inter`.
4.  **Authentication Skeleton (Supabase Auth):**
    *   A basic login form is accessible at `/login`.
    *   Users can sign up/sign in with email/password.
    *   Upon successful authentication, users are redirected to the home page (`/`).
    *   The user session is persisted.

## Traceability Mapping

| Acceptance Criteria | Spec Section(s) | Component(s)/API(s) | Test Idea |
| :------------------ | :-------------------- | :------------------ | :-------------------- |
| 1.1 Project scaffolding | Overview, Detailed Design (Services/Modules) | `next.config.js`, Vercel Deployment | Verify Vercel deployment logs and live URL. |
| 1.2 DB Schema & Types | Detailed Design (Data Models) | Supabase DB, `db/schema.ts`, `database.types.ts` | Inspect Supabase tables; `git diff` generated types. |
| 1.3 UI Library & Styles | Detailed Design (Services/Modules) | `tailwind.config.ts`, `globals.css`, `Button` component | Render button and inspect element for styles/classnames. |
| 1.4 Auth Skeleton | Detailed Design (Services/Modules, APIs) | Supabase Auth, `app/(auth)/login/page.tsx` | Manual test: sign up, log in, verify redirection and session. |


## Risks, Assumptions, Open Questions

## Risks, Assumptions, Open Questions

*   **Risk:** `create-next-app` with Supabase starter might have breaking changes or require significant adjustments upon initialization, impacting the timeline for Epic 1.
    *   **Mitigation:** Verify `npx create-next-app -e with-supabase` command for latest compatibility before execution.
*   **Assumption:** Vercel deployment and Supabase project setup (including RLS for initial database security) are straightforward and well-documented.
    *   **Mitigation:** Allocate time for reviewing official documentation and troubleshooting common setup issues.
*   **Open Question:** What is the exact SQL migration script for the initial schema, or will it be defined programmatically through an ORM?
    *   **Next Step:** Define the precise schema DDL in `db/schema.ts` and confirm migration strategy.
*   **Risk:** `shadcn/ui` and Tailwind CSS configuration might require non-trivial customization to perfectly match UX specifications, leading to delays.
    *   **Mitigation:** Prototyping key UI elements early to validate integration and customization effort.

## Test Strategy Summary

For Epic 1, the test strategy will focus on verifying the successful setup and basic functionality of the project's foundation.

*   **Unit/Integration Tests:**
    *   **Database:** Verify generated types match schema. Test basic CRUD operations against mock Supabase client or a test database.
    *   **Authentication:** Unit test authentication functions (e.g., login, logout) ensuring correct state changes and error handling.
    *   **UI Components:** Basic snapshot tests for `shadcn/ui` components after customization to ensure consistent rendering.
*   **End-to-End (E2E) Testing:**
    *   Verify successful project deployment to Vercel.
    *   Confirm basic navigation to login page and successful authentication flow (signup/signin/signout).
    *   Visual inspection of global styles and `shadcn/ui` component rendering (e.g., buttons, inputs) in the browser.
*   **Developer Experience (DX) Testing:**
    *   Verify `ESLint` and `Prettier` configurations are correctly applied during development.
    *   Ensure type generation (`supabase gen types`) runs without errors and produces expected output.
*   **Accessibility Testing:**
    *   Initial automated checks using tools like `axe-core` on the login and home pages.
    *   Manual keyboard navigation checks for basic interactive elements.

