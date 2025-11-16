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

The user journey for "Digital Guess Who" is designed to be intuitive and engaging, guiding players through a seamless experience from game initiation to conclusion.

1.  **Application Launch & Game Selection:** The journey begins when a user opens the application, presented with clear options to either 'Create Game' or 'Join Game'.
2.  **Game Creation (Host):** A host player selects 'Create Game', configures game settings like difficulty and character set, and receives a unique Game Code. They then enter a 'Waiting for Opponent' screen, sharing the code with a friend.
3.  **Game Joining (Opponent):** An opponent player selects 'Join Game', enters the provided Game Code, and upon validation, is directed to the game room.
4.  **Game Start & Character Selection:** Once both players are in the room, they confirm readiness. The game prompts each player to secretly 'Choose your secret character' from the displayed grid, with a confirmation step to finalize their choice.
5.  **Core Gameplay Loop:**
    *   **Player's Turn:** The active player uses a 'Question Box' to type a yes/no question, with an optional 'AI Hint' button for strategic suggestions. They submit the question.
    *   **Opponent's Answer:** The opponent receives the question and provides a 'Yes' or 'No' answer.
    *   **Elimination:** The active player then eliminates characters from the board that do not match the opponent's answer, visually 'flipping down' their portraits.
    *   **Turn End:** The turn automatically passes to the other player, and this loop continues.
6.  **Making a Guess & Outcome:** At any point during their turn, a player can choose to 'Make a Guess' instead of asking a question. After a confirmation, they select a character. The system then determines if the guess is correct, displaying a 'You Win!' or 'You Lose!' screen to both players accordingly.
7.  **Post-Game Options:** Following the game's conclusion, players are offered options to 'Play Again' or 'Return to Main Menu', facilitating continued engagement.
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
