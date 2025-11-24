# Product Brief: Digital Guess Who

**Date:** 2025-11-16
**Author:** BIP
**Context:** Product Brief

---

## Executive Summary

This document outlines the product brief for "Digital Guess Who," a modern web-based adaptation of the classic board game. The project's goal is to create an engaging and accessible online multiplayer experience that allows friends and family to play together from different locations. The game will not only replicate the core logic of the original but also enhance it with modern features, including the ability for users to upload custom character sets and an AI-powered hint system to assist players. The target audience is broad, ranging from children and young people seeking a digital alternative to nostalgic adults. The proposed technology stack, centered around Next.js and Supabase, is designed for a rapid MVP launch while providing a solid foundation for future extensions.

---

## Core Vision

### Problem Statement

The classic "Guess Who" board game, while popular, is constrained by its physical nature, limiting play to co-located players and a fixed set of characters. This creates a gap for a modern, digital version that can connect players remotely and offer a more dynamic experience.

### Why Existing Solutions Fall Short

Existing digital versions of "Guess Who" often fail to capture the original's charm, suffering from poor user interfaces, a lack of engaging features, and limited replayability. They are frequently seen as simple, uninspired copies rather than modern reinterpretations, leading to a frustrating and unsatisfying user experience.

### Proposed Solution

The proposed solution is to develop a responsive web application that delivers a modern and engaging "Digital Guess Who" experience. This online multiplayer game will allow two players to compete in real-time from any location. The core of the solution is not just to digitize the classic game but to enhance it with features that are only possible in a digital format, such as AI-powered question hints and the ability for users to create and share their own custom character sets. This approach will provide a fresh and replayable experience for both new and nostalgic players.

{{#if key_differentiators}}

### Key Differentiators

{{key_differentiators}}
{{/if}}

---

## Target Users

### Primary Users

The primary users are children, young people, and families who are looking for a fun and interactive game to play together, regardless of physical location. This group values a modern, intuitive user interface and engaging features that go beyond the traditional board game. They are the main audience for features like custom character sets and AI hints.

### Secondary Users

The secondary users are adults who have nostalgic memories of playing "Guess Who" and are looking for a convenient, digital way to relive that experience. This group values the core gameplay mechanics of the original and is less likely to be concerned with advanced features, but will appreciate a polished and user-friendly interface.

{{#if user_journey}}

### User Journey

The user journey is broken down into three distinct flows, ensuring a clear and intuitive experience from start to finish.

**Flow 1: Pre-Game Setup**

1.  **Main Screen & Initial Action:** The user opens the application to a main screen with two clear primary actions: 'Create Game' and 'Join Game'. A "How to Play" guide is available in a secondary menu.
2.  **'Create Game' Flow (Host):**
    *   The Host selects a difficulty level (Easy, Medium, Hard).
    *   The Host is taken to a lobby where they can see the game board and a pool of available characters. They can randomly populate the board or manually upload their own characters (providing a name and image for each).
    *   The lobby displays a unique Game Code with a "Copy" button.
    *   The 'Start Game' button remains disabled until the board is full and a second player has joined.
3.  **'Join Game' Flow (Joining Player):**
    *   The joining player enters the Game Code provided by the host.
    *   Upon validation, they enter the lobby and see the game board being prepared by the host in real-time. They have no actions available at this stage.
4.  **Game Start:** Once the conditions are met, the host clicks 'Start Game', and both players are transitioned to the main game interface.

**Flow 2: Core Gameplay Loop**

1.  **Secret Character Selection:** The first action for both players is to secretly select their character from the board. After confirming their choice, a 'Ready' button becomes active. The game officially begins once both players have clicked 'Ready'. The joining player takes the first turn.
2.  **Turn-Based Play:**
    *   **Asking a Question:** The active player uses a chat-style window to ask a yes/no question. They can type a custom question, select from a pre-made list, or (in a future release) use an 'AI Hint' button.
    *   **Answering:** The opponent receives the question and responds with simple 'Yes' or 'No' buttons.
    *   **Elimination:** The active player clicks on character portraits to gray them out, narrowing down the possibilities based on the answer.
    *   **Ending the Turn:** The player clicks an 'End Turn' button to pass control to the opponent.

**Flow 3: Winning and Rematch**

1.  **Making a Guess:** Instead of asking a question, a player can choose to 'Make a Guess'. After confirming this final decision, they select the character they believe is their opponent's.
2.  **Game Outcome:** A correct guess results in a 'You Win!' screen for the guesser and 'You Lose!' for the opponent. An incorrect guess reverses the outcome.
3.  **Post-Game:** The game over screen provides two options: 'End Game' (return to main menu) or 'Rematch', which immediately restarts the game with the same board and players, skipping the setup lobby.
{{/if}}

---

{{#if success_metrics}}

## Success Metrics

The success of the "Digital Guess Who" MVP will be measured by the following criteria:
-   **Game Completion:** Two players can successfully complete a full game loop (start, play, win/loss) with no critical errors.
-   **Real-time Performance:** Game state changes, such as character eliminations and turn transitions, are synchronized between players with a latency of less than 500ms.
-   **UI Responsiveness:** The core elimination mechanic (clicking to fade a character) is intuitive and has a visual response time of under 100ms.
-   **Compatibility:** The application maintains a usable and clean layout on the latest versions of Chrome and Firefox on desktop.
-   **AI Functionality (Post-MVP):** The AI Hint feature can successfully generate a relevant, grammatically correct yes/no question based on the current set of available characters.
-   **Feature Completeness:** The final deployed application includes at least one fully functional "Nice to Have" extension feature.

{{#if business_objectives}}

### Business Objectives

{{business_objectives}}
{{/if}}

{{#if key_performance_indicators}}

### Key Performance Indicators

{{key_performance_indicators}}
{{/if}}
{{/if}}

---

## MVP Scope

### Core Features

The MVP will focus on delivering the complete, core gameplay loop with the following features:
-   **Two-Player Online Gameplay:** Players can create or join a game room using a unique code.
-   **User-Uploaded Custom Character Sets:** A host player can upload their own character images and names to create a custom game board.
-   **Base Character Pool:** A default set of at least 50 characters will be available.
-   **Interactive Elimination:** Players can visually "flip down" or gray out characters to narrow down possibilities.
-   **Digital Rule Implementation:** The game will enforce the official "Guess Who" rules for turn-based play and win/loss conditions.
-   **Difficulty Settings:** Players can select from Easy (12 characters), Medium (24), and Hard (48) difficulty levels.

### Out of Scope for MVP

To ensure a focused and timely launch, the following features will not be included in the initial MVP release:
-   **AI-powered question hints.** The UI may contain a disabled button for this feature as a teaser for future updates.
-   **Free-form in-game chat.** The question and answer system will be a structured, non-chat interface.
-   A full user account system for stat tracking and saved sets.

### Future Vision

Following a successful MVP launch, the product roadmap includes the phased rollout of the features currently out of scope. The long-term vision is to build a rich, community-driven platform where users can create, share, and play with a vast library of custom character sets, transforming the game into a creative and social hub.

---

{{#if market_analysis}}

## Market Context

{{market_analysis}}
{{/if}}

{{#if financial_considerations}}

## Financial Considerations

{{financial_considerations}}
{{/if}}

{{#if technical_preferences}}

## Technical Preferences

The project will be built on a modern, all-JavaScript technology stack, chosen for its development efficiency and suitability for real-time applications. The decision has been made to proceed with this unified stack and **not** introduce a separate backend language (like Python) to maintain architectural simplicity and meet the project timeline.
-   **Frontend:** Next.js with Tailwind CSS
-   **Backend & Database:** Supabase (for PostgreSQL, real-time sync, and authentication)
-   **AI Integration:** Google Gemini 2.5 Pro (for the future AI hint feature)
This unified stack simplifies development by eliminating the need for a separate backend language, directly supporting the project's timeline.

## Timeline

The project is planned to be completed within a five-week timeframe:
-   **Week 1:** Product Definition
-   **Weeks 2-3:** System & UX Design
-   **Week 4:** Agile Development
-   **Week 5:** Final Testing & Deployment
{{/if}}

{{#if supporting_materials}}

## Supporting Materials

This Product Brief was created based on the following documents:
-   `proposal.md`
-   `docs/brainstorming-session-results-2025-10-26.md`
-   `docs/brainstorming-session-results-2025-11-08.md`
-   `docs/brainstorming-session-results-lørdag 8. november 2025.md`
-   `docs/research-technical-lørdag 8. november 2025.md`
-   `docs/brainstorming-session-results-2025-11-24.md`
{{/if}}

---

_This Product Brief captures the vision and requirements for ibe160._

_It was created through collaborative discovery and reflects the unique needs of this Product Brief project._

{{#if next_workflow}}
_Next: {{next_workflow}} will transform this brief into detailed planning artifacts._
{{else}}
_Next: Use the PRD workflow to create detailed product requirements from this brief._
{{/if}}
