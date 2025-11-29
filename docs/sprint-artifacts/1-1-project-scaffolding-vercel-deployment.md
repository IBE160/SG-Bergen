# Story 1.1: Project Scaffolding & Vercel Deployment

Status: ready-for-dev

## Story

As a developer,
I want to initialize the Next.js + Supabase project and deploy it to Vercel,
So that we have a live URL and a production-ready environment from day one.

## Acceptance Criteria

1.  **Given** I have the necessary Vercel and Supabase credentials
2.  **When** I run the initialization command `npx create-next-app -e with-supabase`
3.  **Then** A new Next.js 15+ (App Router) project is created with TypeScript
4.  **And** The project is connected to a Vercel project
5.  **And** A successful build is deployed to a production URL (e.g., `digital-guess-who.vercel.app`)
6.  **And** The repository is pushed to GitHub

## Tasks / Subtasks

- [ ] **Task: Initialize Next.js + Supabase Project (AC: 2, 3)**
  - [ ] Execute `npx create-next-app -e with-supabase digital-guess-who` in the project root.
  - [ ] Verify the created project uses Next.js App Router and TypeScript.
  - [ ] Add project to Git (if not already done).
- [ ] **Task: Connect to Vercel and Deploy (AC: 4, 5)**
  - [ ] Log in to Vercel CLI (`vercel login`).
  - [ ] Create a new Vercel project and link it to the local directory (`vercel link`).
  - [ ] Configure Vercel environment variables for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - [ ] Trigger an initial Vercel deployment (`vercel --prod`).
  - [ ] Access the deployed URL and verify the Next.js welcome page loads correctly.
- [ ] **Task: Push Project to GitHub (AC: 6)**
  - [ ] Commit all initial project files.
  - [ ] Create a new remote GitHub repository.
  - [ ] Push the local repository to the remote GitHub repository.
- [ ] **Test Task: Validate Project Scaffolding**
  - [ ] Manually check `package.json` for Next.js and Supabase dependencies.
  - [ ] Manually verify `next.config.js` and `tsconfig.json` are present.
  - [ ] Manually verify the Vercel project is linked and deployed.
  - [ ] Manual test: Verify code pushed to GitHub matches local repository.

## Dev Notes

### Context and Summary

This story is foundational, aiming to establish the core technical infrastructure, development environment, and deployment pipeline. It is the prerequisite for all subsequent feature development. Key requirements include using the `npx create-next-app -e with-supabase` command for initialization, targeting Next.js (App Router), TypeScript, Supabase, and Tailwind CSS, and ensuring deployment to Vercel. This directly implements the "Project Foundation" decision.

### Project Structure Notes

This story is responsible for initiating the project, thereby laying down the foundational project structure as outlined in the Architecture document. The `npx create-next-app -e with-supabase` command will establish the core Next.js App Router structure, including `db/` directory placeholders and initial configuration files like `next.config.js`, `tailwind.config.ts`, `tsconfig.json`. This initial setup will align with `kebab-case` for files/folders and `PascalCase` for React components.

### References

*   **Tech Spec:** `docs/tech-spec-epic-1.md`
*   **PRD:** `docs/PRD.md#Executive-Summary` (Digital Guess Who overview)
*   **Architecture:** `docs/architecture.md#Project-Initialization` (Next.js + Supabase Starter)
*   **Architecture:** `docs/architecture.md#Decision-Summary` (Project Foundation, Hosting)
*   **Epic Definition:** `docs/epics.md#Epic-1:-Project-Foundation` (Goal and Scope)

## Dev Agent Record

### Context Reference

*   **Story Context:** `docs/sprint-artifacts/1-1-project-scaffolding-vercel-deployment.context.xml`

### Agent Model Used

gemini-1.5-flash

### Debug Log References

### Completion Notes List

### File List
