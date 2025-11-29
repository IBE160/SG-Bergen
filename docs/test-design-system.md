# System-Level Test Design

## Testability Assessment

- Controllability: PASS - Supabase SDK and Next.js API routes provide good control for data setup and mocking external services. Zustand for client state is also controllable.
- Observability: PASS - Next.js logging is available. Supabase Realtime events offer observability into game state changes. NFRs include measurable criteria for validation.
- Reliability: PASS - Feature-sliced design and decoupled components support isolated and reliable tests. API setup and network-first patterns aid in reproducing failures.

## Architecturally Significant Requirements (ASRs)

- **ASR-PERF-001**: Game state changes, such as character eliminations and turn transitions, shall be synchronized between players with a latency of less than 500ms.
  - Risk Score: 6 (Probability: 2, Impact: 3) - MITIGATE
- **ASR-PERF-002**: The UI elimination mechanic shall have a visual response time under 100ms.
  - Risk Score: 4 (Probability: 2, Impact: 2) - MONITOR
- **ASR-SEC-001**: User authentication (via Supabase) shall be secure. Game session data shall be protected from unauthorized access or manipulation.
  - Risk Score: 6 (Probability: 2, Impact: 3) - MITIGATE
- **ASR-SCAL-001**: The codebase shall be structured to allow for future features. The chosen technology stack should support a growing number of concurrent users.
  - Risk Score: 2 (Probability: 1, Impact: 2) - DOCUMENT
- **ASR-ACC-001**: The application shall maintain a usable and clean layout on the latest versions of Chrome and Firefox on desktop.
  - Risk Score: 1 (Probability: 1, Impact: 1) - DOCUMENT

## Test Levels Strategy

- Unit: 40% - Fast feedback for isolated pure functions, utility logic, and complex game logic in Zustand stores.
- Component: 30% - Validate isolated React components (shadcn/ui, CharacterCard) and visual regression. Playwright Component Testing.
- API (Integration): 20% - Verify Supabase RLS, Next.js API contracts, and business logic across services. Playwright `request` fixture.
- E2E: 10% - Critical user journeys like Game Creation, Game Joining, and Core Gameplay Loop. Playwright for browser automation.

## NFR Testing Approach

- Security: Playwright E2E tests for auth/authz, RLS, and common vulnerabilities (SQL injection, XSS). `npm audit` in CI.
- Performance: `k6` for load testing (concurrent users, real-time latency). Playwright for UI response times.
- Reliability: Playwright E2E tests for API failure simulation (mock 500s), network disconnections, and graceful degradation.
- Maintainability: CI/CD checks for code coverage (Jest/Vitest), code duplication (jscpd), and linting/formatting (ESLint, Prettier).

## Test Environment Requirements

- Local: Developer environment for unit/component tests.
- Staging: Production-like environment with dedicated Supabase instance for API/E2E tests.
- Production-like: Performance testing using `k6`.

## Testability Concerns (if any)

- **Real-time Event Testing**: Reliably automating and reproducing precise latency measurements (<500ms) for Supabase Realtime event synchronization in CI environments can be challenging. This might lead to flaky tests.
  - Mitigation: Mock Realtime in unit/integration tests, and use E2E for actual integration, accepting some non-determinism in latency measurements.

## Recommendations for Sprint 0

- Implement robust test data factories and fixtures for Supabase data to ensure isolated and repeatable tests.
- Set up Playwright for E2E and Component testing, and integrate into CI pipeline.
- Establish initial `k6` performance test scripts for real-time latency measurements.
- Configure CI/CD for code quality checks (coverage, duplication, linting).
