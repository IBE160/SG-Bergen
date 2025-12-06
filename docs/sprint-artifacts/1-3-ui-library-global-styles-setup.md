# Story 1.3: UI Library & Global Styles Setup

Status: ready-for-dev

## Story

As a developer,
I want to set up Tailwind CSS and `shadcn/ui` with the project's defined color palette and typography,
so that all UI components built are consistent and adhere to the established visual design and development standards.

## Acceptance Criteria
(Sourced primarily from Epic 1 Technical Specification and UX Design Specification)

1.  **Given** the project is initialized (Story 1.1 & 1.2 done)
    **When** I install `shadcn/ui` and configure `tailwind.config.ts`
    **Then** the color palette from UX Spec (Primary: #4299E1, Secondary: #48BB78, Destructive: #E53E3E, Background: #1A202C) is available as utility classes (e.g., `bg-primary`, `text-destructive`)
2.  **And** I can import and use a basic `Button` component from `@/components/ui/button`
3.  **And** the global font is set to `Inter`

## Tasks / Subtasks

- [ ] **Install `shadcn/ui` and configure `tailwind.config.ts`** (AC: 1)
  - [ ] Run `npx shadcn-ui@latest init` within the `digital-guess-who` directory.
  - [ ] Update `digital-guess-who/tailwind.config.ts` to include the color palette (Primary: `#4299E1`, Secondary: `#48BB78`, Destructive: `#E53E3E`, Background: `#1A202C`, Card/Panel Background: `#2D3748`).
  - [ ] Verify dark mode is the default appearance in `tailwind.config.ts`.
- [ ] **Configure global styles and font** (AC: 3)
  - [ ] Update `digital-guess-who/app/globals.css` to import Tailwind base styles and set `Inter` as the global font.
  - [ ] Verify `Inter` font is applied to the application.
- [ ] **Integrate and verify a basic `shadcn/ui` Button component** (AC: 2)
  - [ ] Add a basic `Button` component using `npx shadcn-ui@latest add button`.
  - [ ] Import and use the `Button` component in a test page or a temporary component to verify its functionality and styling.
  - [ ] Ensure the `Button` component correctly applies the primary accent color (`#4299E1`).
- [ ] **Testing**
  - [ ] Manually verify that color utility classes (e.g., `bg-primary`, `text-destructive`) are available and apply the correct colors in a temporary test component.
  - [ ] Manually verify that the `shadcn/ui` `Button` component is rendered with the correct styling and font.

## Dev Notes

- **Relevant architecture patterns and constraints:**
  - Tailwind CSS and shadcn/ui are chosen for styling and UI components, as per Architecture and UX Design specifications.
  - The project follows a feature-sliced design, with shared UI components in `components/ui`.
  - Consistent naming conventions (kebab-case for files, PascalCase for components) should be adhered to.
  - The color palette and typography defined in the UX Design Specification are authoritative.
- **Source tree components to touch:**
  - `digital-guess-who/tailwind.config.ts`: Configuration for Tailwind colors and typography.
  - `digital-guess-who/app/globals.css`: To import Tailwind base styles and Inter font.
  - `digital-guess-who/components/ui/button.tsx` (or similar for other shadcn/ui components): To verify `shadcn/ui` integration.
- **Testing standards summary:**
  - Visual regression testing or simple snapshot testing for basic component rendering might be considered, though not explicitly required for this story's ACs.
  - Verify that utility classes for colors are correctly applied and that the `Button` component renders as expected.

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming):
  - New `shadcn/ui` components will be added under `digital-guess-who/components/ui`.
  - Configuration files (`tailwind.config.ts`, `globals.css`) are at the project root as per standard Next.js setup.
- Detected conflicts or variances (with rationale):
  - No direct conflicts with previous story's file changes. However, the pending `supabase` CLI setup from the previous story is a general project concern that needs resolution for future type-safe development, though not blocking this specific UI setup.

### References

- [Source: docs/PRD.md#FR1.3-UI/UX-Quality] - General UI/UX quality criteria.
- [Source: docs/architecture.md#Decision-Summary] - Tailwind CSS, shadcn/ui, Inter Font.
- [Source: docs/architecture.md#Implementation-Patterns] - Naming, Structure, and Format Patterns.
- [Source: docs/ux-design-specification.md#3.-Visual-Foundation] - Detailed Color System, Typography, Visual Hierarchy.
- [Source: docs/ux-design-specification.md#6.-Component-Library] - Component Strategy, Customization of shadcn/ui.
- [Source: docs/ux-design-specification.md#7.-UX-Pattern-Decisions] - Button Hierarchy, Feedback Patterns.
- [Source: docs/epics.md#Story-1.3:-UI-Library-&-Global-Styles-Setup] - Original story statement and acceptance criteria.
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#UI-Library-&-Global-Styles-Setup] - Detailed technical specification for this story.

### Learnings from Previous Story

**From Story 1.2: Database Schema & Type Generation (Status: in-progress)**

- **Pending Review Items / Actionable Items for Future Stories (from previous story's Senior Developer Review)**:
    - [ ] [AI-Review][High] Ensure the Supabase CLI is available and runnable, then execute `npx supabase gen types typescript --schema public > digital-guess-who/db/types.ts` within the `digital-guess-who` directory to fulfill AC2 and automate type generation.
    - [ ] [AI-Review][High] Address and re-enable the excluded tests (`game-store.test.ts`, `turn-manager.test.ts`) to restore full project test coverage. This may require updating import paths or verifying source file existence.

[Source: stories/1-2-database-schema-type-generation.md#Senior-Developer-Review-(AI)]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-3-ui-library-global-styles-setup.context.xml

### Agent Model Used

gemini-1.5-flash

### Debug Log References

- (No specific debug logs for this story's generation were provided, assuming standard generation process)

### Completion Notes List

- Story 1.2: Database Schema & Type Generation (Status: in-progress) highlights:
    - New Files Created: `digital-guess-who/db/schema.ts`, `digital-guess-who/db/types.ts`, `tests/unit/db/types.test.ts`
    - Modified Files: `digital-guess-who/jest.config.ts`, `digital-guess-who/package.json`, `digital-guess-who/tsconfig.json`
    - Architectural Decisions: Supabase (PostgreSQL) is the chosen database, type generation is critical for type-safety, RLS needs to be enabled (permissive for MVP).
    - Technical Debt:
        - AC2 Missing Implementation: Manual type creation instead of `supabase gen types typescript`.
        - AC1 Partial Implementation: Schema defined but not yet applied to the Supabase DB.
        - Test Generation Dependency: Reliance on manual `db/types.ts` update.
    - Warnings/Recommendations:
        - Project Test Coverage Gap: Other existing tests (`game-store.test.ts`, `turn-manager.test.ts`) were temporarily excluded from Jest runs. This needs to be addressed for overall project health.
        - False Task Completion: AC2 was marked complete in the previous story despite the agent stating it was not executed. This highlights a process integrity issue.
    - Pending Review Items / Actionable Items for Future Stories:
        - User needs to apply SQL DDL from `digital-guess-who/db/schema.ts` to Supabase project.
        - User needs to run `npx supabase gen types typescript` after schema application.
        - Address and re-enable the excluded tests (`game-store.test.ts`, `turn-manager.test.ts`).

### File List

- digital-guess-who/tailwind.config.ts (modified)
- digital-guess-who/app/globals.css (modified)
- digital-guess-who/components/ui/button.tsx (new/modified by `shadcn/ui` integration)

## Change Log

- **lørdag 6. desember 2025**: Initial draft created.