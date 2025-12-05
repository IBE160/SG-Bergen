# Story 1.1: Project Scaffolding & Vercel Deployment

Status: ready-for-dev

## Story

As a developer,
I want to initialize the Next.js + Supabase project and deploy it to Vercel,
So that we have a live URL and a production-ready environment from day one.

## Requirements Context Summary

The goal of this story is to establish the foundational infrastructure for the "Digital Guess Who" project, enabling a rapid start to feature development with a production-ready environment.

**Core Story:**
As a developer, I want to initialize the Next.js + Supabase project and deploy it to Vercel, So that we have a live URL and a production-ready environment from day one.

**Key Acceptance Criteria:**
*   Project is initialized using `npx create-next-app -e with-supabase`.
*   A new Next.js 15+ (App Router) project with TypeScript is created.
*   Project is connected to a Vercel project, and a successful deployment occurs.
*   The repository is pushed to GitHub.

**Architectural & Technical Context:**
*   **Project Initialization:** Utilize the official Vercel Next.js + Supabase starter template for `digital-guess-who`.
*   **Technologies:** Next.js (App Router), TypeScript, Supabase (Client & Server config), Tailwind CSS, ESLint & Prettier.
*   **Hosting:** Vercel, for native Next.js optimization and zero-config deployment.
*   **Deployment:** Automatic deployments via Vercel upon push to the `main` branch.
*   **Configuration:** `.env.local` must be correctly set up with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Vercel environment variables also need configuration.
*   **Security:** API keys should be managed via `.env.local` and Vercel Environment Variables, never committed to Git.

## Acceptance Criteria

1.  **Given** I have the necessary Vercel and Supabase credentials
2.  **When** I run the initialization command `npx create-next-app -e with-supabase`
3.  **Then** A new Next.js 15+ (App Router) project is created with TypeScript
4.  **And** The project is connected to a Vercel project
5.  **And** A successful build is deployed to a production URL (e.g., `digital-guess-who.vercel.app`)
6.  **And** The repository is pushed to GitHub

## Tasks / Subtasks

- [ ] **Project Initialization** (AC: 1, 2, 3, 6)
  - [ ] Execute `npx create-next-app -e with-supabase digital-guess-who`.
  - [ ] Configure the Supabase project (create new project on Supabase, get API keys).
  - [ ] Push the initialized project to GitHub.
- [ ] **Vercel Deployment Setup** (AC: 4, 5)
  - [ ] Connect the GitHub repository to a new Vercel project.
  - [ ] Configure Vercel environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) with values from Supabase.
  - [ ] Verify successful build and deployment to a production URL.
- [ ] **Verification**
  - [ ] **(AC: 3)** Verify a new Next.js 15+ (App Router) project with TypeScript is created locally.
  - [ ] **(AC: 4)** Verify in Vercel dashboard that the project is connected to the GitHub repository.
  - [ ] **(AC: 5)** Access the deployed production URL and verify the landing page loads without errors.
  - [ ] **(AC: 6)** Verify the repository is pushed to GitHub with the initial project scaffolding.

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-1-project-scaffolding-vercel-deployment.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log
