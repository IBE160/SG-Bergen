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

The user journey is divided into three main flows: Pre-Game Setup, Core Gameplay, and Winning/Rematching.

**1. Pre-Game Setup**

*   **Initial Interaction:** The user is greeted with a main screen featuring two primary options: 'Create Game' and 'Join Game'. A 'How to Play' guide is also accessible.
*   **Host Flow ('Create Game'):**
    1.  **Difficulty Selection:** The host chooses a difficulty level (Easy, Medium, Hard), which determines the number of characters on the board.
    2.  **Lobby & Board Setup:** The host enters a waiting lobby where they see the game board. They can manually populate the board with characters from a character pool, use a "Fill in Board" button for random selection, or upload custom characters.
    3.  **Invite Opponent:** The host is provided with a unique Game Code to share. The 'Start Game' button remains disabled until another player joins and the board is full.
*   **Joiner Flow ('Join Game'):**
    1.  **Enter Code:** The joining player enters the Game Code provided by the host.
    2.  **Waiting Lobby:** The joiner enters the lobby and sees the board being prepared by the host in real-time. They have no actions available at this stage and wait for the host to start the game.

**2. Core Gameplay Loop**

*   **Secret Character Selection:** Once the host starts the game, both players are prompted to secretly select their character from the main board. Their choice is displayed in a private "Your Character" area. A 'Ready' button appears.
*   **Starting the Game:** The game officially begins once both players have clicked 'Ready'. The player who joined the game takes the first turn.
*   **Turn-Based Play:**
    1.  **Ask a Question:** The active player uses a chat-style interface to ask a yes/no question. They can type a custom question, choose from a predefined list, or use an AI Hint.
    2.  **Provide an Answer:** The opposing player responds with simple 'Yes' or 'No' buttons.
    3.  **Eliminate Characters:** Based on the answer, the active player clicks on character portraits to gray them out, narrowing down the possibilities.
    4.  **End Turn:** The player clicks 'End Turn' to pass control to their opponent.

**3. Winning and Rematching**

*   **Making a Final Guess:** At any point during their turn, a player can choose to 'Make a Guess' instead of asking a question. They then select the single character they believe is their opponent's secret one.
*   **Game Outcome:**
    *   A correct guess results in a win for the guessing player.
    *   An incorrect guess results in a loss.
*   **Game Over Screen:** A pop-up announces the winner and provides two options: 'End Game' (returns to the main menu) or 'Rematch'.
*   **Rematch:** If 'Rematch' is chosen, players return directly to the secret character selection phase with the same board, skipping the initial setup lobby.
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
-   **Base Character Pool:** A default set of at least 50 characters will be available.
-   **Interactive Elimination:** Players can visually "flip down" or gray out characters to narrow down possibilities.
-   **Digital Rule Implementation:** The game will enforce the official "Guess Who" rules for turn-based play and win/loss conditions.
-   **Difficulty Settings:** Players can select from Easy (12 characters), Medium (24), and Hard (48) difficulty levels.

### Out of Scope for MVP

To ensure a focused and timely launch, the following features will not be included in the initial MVP release:
-   User-uploaded custom character sets.
-   In-game chat functionality.
-   AI-powered question hints.
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

The project will be built on a modern, all-JavaScript technology stack, chosen for its development efficiency and suitability for real-time applications:
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
-   `docs/brainstorming-session-results-2025-11-24.md`
-   `docs/brainstorming-session-results-lørdag 8. november 2025.md`
-   `docs/research-technical-lørdag 8. november 2025.md`
{{/if}}

---

_This Product Brief captures the vision and requirements for ibe160._

_It was created through collaborative discovery and reflects the unique needs of this Product Brief project._

{{#if next_workflow}}
_Next: {{next_workflow}} will transform this brief into detailed planning artifacts._
{{else}}
_Next: Use the PRD workflow to create detailed product requirements from this brief._
{{/if}}
