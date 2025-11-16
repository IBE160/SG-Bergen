# ibe160 - Epic Breakdown

**Author:** BIP
**Date:** 2025-11-16
**Project Level:** Beginner
**Target Scale:** MVP

---

## Overview

This document provides the complete epic and story breakdown for ibe160, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

This document breaks down the project into the following epics:

*   **Epic 1: Project Foundation:** Establishes the foundational infrastructure for the project.
*   **Epic 2: Game Session Management:** Covers all functionality and UI for creating, joining, and setting up a game.
*   **Epic 3: Core Gameplay Loop:** Encompasses all the mechanics and UI for playing the game itself.
*   **Epic 4: Post-Game Experience:** Handles the user flow and UI after a game has concluded.

## Epic Breakdown Summary

The "Digital Guess Who" project has been successfully broken down into four epics: Project Foundation, Game Session Management, Core Gameplay Loop, and Post-Game Experience. Each epic contains detailed, vertically sliced stories with clear BDD-style acceptance criteria, ensuring a structured and actionable plan for implementation. The breakdown prioritizes foundational setup, followed by core game functionality, and concludes with the post-game user experience, providing a clear path for incremental value delivery.

---

<!-- Repeat for each epic (N = 1, 2, 3...) -->

## Epic 1: Project Foundation

Establishes the foundational infrastructure for the project, including project setup, core dependencies, and a basic deployment pipeline. This enables all subsequent development work.

### Story 1.1: Initialize Next.js Project

As a developer,
I want to initialize a new Next.js project with TypeScript and Tailwind CSS,
So that I have a modern frontend development environment.

**Traceability:** None (Foundational)

**Acceptance Criteria:**

**Given** a new project directory
**When** I run the initialization command
**Then** a Next.js project with TypeScript and Tailwind CSS is set up
**And** the project successfully compiles and runs locally.

**Prerequisites:** None.

**Technical Notes:** Use `create-next-app --typescript --tailwind`.

### Story 1.2: Set Up Project Structure and Linting

As a developer,
I want to establish a standard project structure and set up linting rules,
So that the codebase is organized and maintains a consistent style.

**Traceability:** None (Foundational)

**Acceptance Criteria:**

**Given** an initialized Next.js project
**When** I create the standard directory structure (e.g., `components`, `lib`, `styles`)
**Then** the project has a clear and organized file structure
**And** ESLint and Prettier are configured to enforce a consistent code style.

**Prerequisites:** Story 1.1.

**Technical Notes:** Create directories for components, utilities, etc. Configure `.eslintrc.json` and `.prettierrc`.

### Story 1.3: Integrate Supabase Client

As a developer,
I want to integrate the Supabase client into the Next.js project,
So that the application can communicate with the Supabase backend.

**Traceability:** None (Foundational)

**Acceptance Criteria:**

**Given** a running Next.js project
**When** I install and configure the Supabase client library
**Then** the application can successfully connect to the Supabase project
**And** environment variables for Supabase URL and anon key are securely managed.

**Prerequisites:** Story 1.1.

**Technical Notes:** Use the `@supabase/supabase-js` library. Use `.env.local` for environment variables.

### Story 1.4: Implement Basic Deployment Pipeline

As a developer,
I want to set up a basic continuous deployment pipeline,
So that changes can be automatically deployed to a hosting service.

**Traceability:** None (Foundational)

**Acceptance Criteria:**

**Given** a working Next.js project in a Git repository
**When** I push changes to the main branch
**Then** the application is automatically built and deployed to a preview environment
**And** the deployed application is accessible via a URL.

**Prerequisites:** Story 1.1.

**Technical Notes:** Use the free tier of Vercel or Netlify, connecting it to the Git repository.


---

## Epic 2: Game Session Management

Covers all functionality and UI for creating, joining, and setting up a game.

### Story 2.1: Implement Game Creation UI and Logic

As a user,
I want to create a new game session and receive a unique game code,
So that I can invite a friend to play.

**Traceability:** FR1.1

**Acceptance Criteria:**

**Given** I am on the home screen
**When** I click "Create Game"
**Then** a unique, shareable game code is generated and displayed on the screen
**And** the system creates a new game session in the backend with a "waiting" status.

**Prerequisites:** Epic 1 completed.

**Technical Notes:** Use Supabase Realtime for session management. The game code should be short and easy to share.

### Story 2.2: Implement Game Joining UI and Logic

As a user,
I want to join an existing game session by entering a game code,
So that I can play with a friend.

**Traceability:** FR1.2

**Acceptance Criteria:**

**Given** I am on the home screen
**When** I click "Join Game" and enter a valid game code
**Then** I am directed to the game lobby for that session
**And** if I enter an invalid or expired code, a clear error message is displayed.

**Prerequisites:** Story 2.1.

**Technical Notes:** Validate game code against active sessions in the backend.

### Story 2.3: Implement Player Readiness and Lobby UI

As a user,
I want to indicate my readiness to start the game,
So that the game only begins when both players are prepared.

**Traceability:** FR1.3

**Acceptance Criteria:**

**Given** I am in the game lobby with another player
**When** I click the "Ready" button, my status updates to "Ready"
**And** when both players are "Ready", the game automatically transitions to the character selection screen for both players.

**Prerequisites:** Story 2.2.

**Technical Notes:** Use Supabase Realtime to synchronize player readiness status and trigger the game start.

### Story 2.4: Implement Difficulty Selection

As a user,
I want to select the game difficulty (Easy, Medium, Hard) when creating a game,
So that I can choose the number of characters on the board.

**Traceability:** FR4.1

**Acceptance Criteria:**

**Given** I am on the "Create Game" screen
**When** I select a difficulty level (Easy, Medium, or Hard)
**Then** the game session is configured with the corresponding number of characters (12, 24, or 48).

**Prerequisites:** Story 2.1.

**Technical Notes:** Store the selected difficulty setting in the game session data on Supabase.


---

## Epic 3: Core Gameplay Loop

Encompasses all the mechanics and UI for playing the game itself.

### Story 3.1: Implement Character Selection UI and Logic

As a user,
I want to secretly select my character from the available grid,
So that the game can begin.

**Traceability:** FR2.1

**Acceptance Criteria:**

**Given** I am on the character selection screen
**When** I click on a character
**Then** it is highlighted as my secret character
**And** when I confirm my selection, my choice is hidden from the opponent.

**Prerequisites:** Epic 2 completed.

**Technical Notes:** Store selected character in Supabase, ensure opponent cannot see it.

### Story 3.2: Implement Turn-Based Gameplay

As a user,
I want the game to enforce turn-based play,
So that players alternate actions.

**Traceability:** FR3.1

**Acceptance Criteria:**

**Given** a game is in progress
**When** one player completes an action
**Then** the turn automatically passes to the other player
**And** the UI clearly indicates whose turn it is.

**Prerequisites:** Story 3.1.

**Technical Notes:** Use Supabase Realtime to manage and synchronize turn state.

### Story 3.3: Implement Questioning and Answering UI

As a user,
I want to ask yes/no questions and receive answers from my opponent,
So that I can gather information to guess their character.

**Traceability:** FR3.2

**Acceptance Criteria:**

**Given** it is my turn
**When** I type a question and submit it
**Then** my opponent receives the question
**And** my opponent can select "Yes" or "No" to answer.

**Prerequisites:** Story 3.2.

**Technical Notes:** Implement a text input for questions and two buttons for answers.

### Story 3.4: Implement Character Elimination UI

As a user,
I want to visually eliminate characters from my board based on my opponent's answers,
So that I can narrow down the possibilities.

**Traceability:** FR3.3

**Acceptance Criteria:**

**Given** I have received an answer
**When** I click on a character
**Then** it visually "flips down" or grays out
**And** this state is preserved throughout the game.

**Prerequisites:** Story 3.3.

**Technical Notes:** Use CSS transitions for the "flip down" effect. Store eliminated characters in Supabase.

### Story 3.5: Implement Guessing and Win/Loss Condition

As a user,
I want to make a guess about my opponent's secret character and see the game outcome,
So that I know if I won or lost.

**Traceability:** FR3.4, FR3.6

**Acceptance Criteria:**

**Given** it is my turn
**When** I select a character as my guess
**Then** the system checks if it's correct
**And** a "You Win!" or "You Lose!" screen is displayed to both players based on the outcome.

**Prerequisites:** Story 3.4.

**Technical Notes:** Implement game end logic and display appropriate messages.


---

## Epic 4: Post-Game Experience

Handles the user flow and UI after a game has concluded.

### Story 4.1: Implement Post-Game Options UI

As a user,
I want to see options to "Play Again" or "Return to Main Menu" after a game ends,
So that I can easily continue playing or navigate elsewhere.

**Traceability:** FR4.2

**Acceptance Criteria:**

**Given** a game has concluded (win/loss screen displayed)
**When** the game ends
**Then** "Play Again" and "Return to Main Menu" buttons are presented
**And** clicking "Play Again" initiates a new game session
**And** clicking "Return to Main Menu" navigates to the home screen.

**Prerequisites:** Epic 3 completed.

**Technical Notes:** Ensure proper state reset for "Play Again" and navigation for "Return to Main Menu".
