# ibe160 - Product Requirements Document

**Author:** BIP
**Date:** 2025-11-16
**Version:** 1.0

---

## Executive Summary

"Digital Guess Who" reimagines the classic board game for the modern web, enabling friends to connect and play remotely. The project's core magic lies in this shared social experience. As a school project, the focus is on delivering a high-quality, stable, and intuitive web application that demonstrates professional development practices. The MVP is tightly scoped to the core gameplay loop, while future plans for user-generated content and AI-powered hints showcase the project's extensibility. This PRD outlines the full vision, from functional requirements for game setup and mechanics to non-functional requirements for performance and security, providing a solid foundation for the next phase: breaking down these requirements into actionable implementation epics.

---

## Project Classification

**Technical Type:** Web Application
**Domain:** Gaming / Entertainment
**Complexity:** Low to Medium

"Digital Guess Who" is a modern web-based adaptation of the classic board game, aiming to provide an engaging and accessible online multiplayer experience for friends and family. It will replicate core logic while enhancing it with features like custom character sets and AI-powered hints, targeting a broad audience from children to nostalgic adults.

{{#if domain_context_summary}}

### Domain Context

{{domain_context_summary}}
{{/if}}

---

## Success Criteria

The success of the "Digital Guess Who" school project will be measured by the following criteria:
*   **Core Gameplay Loop:** Two players can successfully complete a full game loop (start, play, win/loss) with no critical bugs or disconnections, demonstrating a stable and reliable social experience.
*   **Real-time Performance:** Game state changes, such as character eliminations and turn transitions, are synchronized between players with a latency of less than 500ms.
*   **UI/UX Quality:** The application's user interface is intuitive, responsive, and adheres to basic heuristic design principles (e.g., consistency, feedback, and error prevention).
*   **Code Quality & Process:** The project is developed following modern coding standards, with clear documentation and effective use of version control, demonstrating a professional development process.
*   **MVP Feature Completeness:** The final deployed application includes a fully functional difficulty setting (Easy, Medium, Hard).
*   **Extensibility (Post-MVP Goal):** The codebase is structured in a way that allows for future features (like the AI Hint system) to be added with reasonable effort, demonstrating a well-architected design.

{{#if business_metrics}}

### Business Metrics

{{business_metrics}}
{{/if}}

---

## Product Scope

### MVP - Minimum Viable Product

The MVP will focus on delivering the complete, core gameplay loop with the following features, ensuring a functional and engaging experience for a school project:

*   **Two-Player Online Gameplay:** Players can create or join a game room using a unique code, enabling the core social interaction.
*   **Base Character Pool:** A default set of at least 50 characters will be available, providing sufficient variety for initial play.
*   **Interactive Elimination:** Players can visually "flip down" or gray out characters to narrow down possibilities, maintaining the classic game mechanic.
*   **Digital Rule Implementation:** The game will enforce the official "Guess Who" rules for turn-based play and win/loss conditions, ensuring faithful adaptation.
*   **Difficulty Settings:** Players can select from Easy (12 characters), Medium (24), and Hard (48) difficulty levels, offering replayability and catering to different skill levels.

### Growth Features (Post-MVP)

These features are planned for implementation after the successful delivery of the MVP, enhancing the game's depth and user engagement:

*   User-uploaded custom character sets, fostering community content creation.
*   In-game chat functionality, improving player interaction.
*   AI-powered question hints, providing strategic assistance.
*   A full user account system for stat tracking and saved sets, personalizing the experience.

### Vision (Future)

Following a successful MVP launch and the rollout of growth features, the long-term vision is to build a rich, community-driven platform where users can create, share, and play with a vast library of custom character sets, transforming the game into a creative and social hub. This demonstrates the project's potential for significant future expansion.

---

{{#if domain_considerations}}

## Domain-Specific Requirements

{{domain_considerations}}

This section shapes all functional and non-functional requirements below.
{{/if}}

---

{{#if innovation_patterns}}

## Innovation & Novel Patterns

{{innovation_patterns}}

### Validation Approach

{{validation_approach}}
{{/if}}

---

{{#if project_type_requirements}}

## {{project_type}} Specific Requirements

As a web application, "Digital Guess Who" has the following specific requirements:
*   **Responsive Web Application:** The application must be a responsive web application, adapting to various screen sizes and devices.
*   **Browser Compatibility:** The application must maintain a usable and clean layout on the latest versions of Chrome and Firefox on desktop.
*   **Real-time Synchronization:** Game state changes, such as character eliminations and turn transitions, must be synchronized between players in real-time.

{{#if endpoint_specification}}

### API Specification

{{endpoint_specification}}
{{/if}}

{{#if authentication_model}}

### Authentication & Authorization

{{authentication_model}}
{{/if}}

{{#if platform_requirements}}

### Platform Support

{{platform_requirements}}
{{/if}}

{{#if device_features}}

### Device Capabilities

{{device_features}}
{{/if}}

{{#if tenant_model}}

### Multi-Tenancy Architecture

{{tenant_model}}
{{/if}}

{{#if permission_matrix}}

### Permissions & Roles

{{permission_matrix}}
{{/if}}
{{/if}}

---

{{#if ux_principles}}

## User Experience Principles

The user experience for "Digital Guess Who" will be guided by the following principles:
*   **Intuitive and Engaging:** The interface should be modern, intuitive, and engaging, catering to both children and nostalgic adults.
*   **Seamless Interaction:** Core interactions, especially character elimination, should be fluid and responsive.
*   **Accessibility:** The design should aim for accessibility to ensure a broad audience can enjoy the game.

### Key Interactions

Key interactions within "Digital Guess Who" include:
*   **Game Creation/Joining:** Users can easily create a new game or join an existing one using a unique code.
*   **Character Selection:** Players secretly choose their character from the game grid.
*   **Questioning and Answering:** Players ask yes/no questions, and opponents provide answers.
*   **Character Elimination:** Players visually eliminate characters based on answers.
*   **Making a Guess:** Players can attempt to guess the opponent's character.
*   **Post-Game Options:** Users can choose to play again or return to the main menu after a game concludes.
{{/if}}

---

## Functional Requirements

### Game Setup & Management:
*   **FR1.1 - Game Creation:** The system shall allow a user to create a new game session, generating a unique game code.
    *   *Acceptance Criteria:* A host user can initiate a game and receive a shareable code. The game session is created in the backend.
*   **FR1.2 - Game Joining:** The system shall allow a user to join an existing game session by entering a valid game code.
    *   *Acceptance Criteria:* A guest user can successfully join a game using a provided code. The system provides a clear error message for invalid or expired codes.
*   **FR1.3 - Player Readiness:** The system shall allow both players to confirm their readiness before starting a game.
    *   *Acceptance Criteria:* Game starts only after both players signal readiness.

### Character Management:
*   **FR2.1 - Secret Character Selection:** The system shall allow each player to secretly select one character from the available grid.
    *   *Acceptance Criteria:* Each player can choose a secret character, and this choice remains hidden from the opponent. The selection is confirmed and cannot be changed after confirmation.
*   **FR2.2 - Base Character Pool:** The system shall provide a default pool of at least 50 characters for selection.
    *   *Acceptance Criteria:* A minimum of 50 distinct characters are available in the default pool.

### Gameplay Mechanics:
*   **FR3.1 - Turn-Based Play:** The system shall enforce turn-based gameplay, alternating between players.
    *   *Acceptance Criteria:* Only the active player can perform actions; turn automatically passes after an action. The UI clearly indicates whose turn it is.
*   **FR3.2 - Questioning & Answering:** The system shall allow the active player to ask a yes/no question and the non-active player to provide a "Yes" or "No" answer.
    *   *Acceptance Criteria:* An active player can input and submit a question. The non-active player receives the question and can select "Yes" or "No".
*   **FR3.3 - Character Elimination:** The system shall allow the active player to visually eliminate characters from their board based on the opponent's answer.
    *   *Acceptance Criteria:* An active player can "flip down" or gray out characters on their grid. This state is preserved between turns.
*   **FR3.4 - Guessing & Win/Loss Condition:** The system shall allow the active player to make a guess about the opponent's secret character and determine the winner/loser.
    *   *Acceptance Criteria:* An active player can select a character as their guess. A correct guess leads to a win screen; an incorrect guess leads to a loss screen.

### Game Progression:
*   **FR4.1 - Difficulty Settings:** The system shall allow players to select game difficulty (Easy, Medium, Hard) which adjusts the number of characters (12, 24, 48 respectively).
    *   *Acceptance Criteria:* Game setup includes difficulty selection, correctly configuring character count.
*   **FR4.2 - Post-Game Options:** The system shall provide options to "Play Again" or "Return to Main Menu" after a game concludes.
    *   *Acceptance Criteria:* Users are presented with play again/main menu options at game end.

---

## Non-Functional Requirements

### Performance
*   **Why it matters:** Essential for a smooth and enjoyable real-time multiplayer game experience.
*   **Criteria:**
    *   Game state changes, such as character eliminations and turn transitions, shall be synchronized between players with a latency of less than 500ms.
    *   The UI elimination mechanic shall have a visual response time under 100ms.

### Security
*   **Why it matters:** To protect user data and ensure fair play in a multiplayer environment.
*   **Criteria:**
    *   User authentication (via Supabase) shall be secure.
    *   Game session data shall be protected from unauthorized access or manipulation.

### Scalability
*   **Why it matters:** To ensure the project can grow and accommodate future features and potential user base expansion.
*   **Criteria:**
    *   The codebase shall be structured to allow for future features (e.g., AI Hint system, custom character sets) to be added with reasonable effort.
    *   The chosen technology stack (Next.js, Supabase) should support a growing number of concurrent users for a web game.

### Accessibility
*   **Why it matters:** To ensure the game is usable by a broad audience across common desktop browsers.
*   **Criteria:**
    *   The application shall maintain a usable and clean layout on the latest versions of Chrome and Firefox on desktop.
    *   The UI/UX design shall adhere to basic heuristic design principles to ensure intuitiveness and ease of use.

{{#if integration_requirements}}
### Integration
{{integration_requirements}}
{{/if}}

{{#if no_nfrs}}
_No specific non-functional requirements identified for this project type._
{{/if}}

---

## Implementation Planning

**Project Track:** BMad Method

### Epic Breakdown

The functional requirements for the MVP will be organized into the following epics:

*   **Epic 1: Game Session Management**
    *   *Summary:* Covers all functionality related to creating, joining, and setting up a game.
    *   *Includes:* FR1.1 (Game Creation), FR1.2 (Game Joining), FR1.3 (Player Readiness), FR4.1 (Difficulty Settings).

*   **Epic 2: Core Gameplay Loop**
    *   *Summary:* Encompasses all the mechanics of playing the game itself.
    *   *Includes:* FR2.1 (Secret Character Selection), FR3.1 (Turn-Based Play), FR3.2 (Questioning & Answering), FR3.3 (Character Elimination), FR3.4 (Guessing & Win/Loss Condition).

*   **Epic 3: User Interface & Experience (UI/UX)**
    *   *Summary:* Focuses on creating the visual and interactive elements of the game.
    *   *Includes:* Implementing the UI for all functional requirements, ensuring responsiveness and adherence to UX principles.

*   **Epic 4: Post-Game Experience**
    *   *Summary:* Handles the user flow after a game has concluded.
    *   *Includes:* FR4.2 (Post-Game Options).

---

## References

- Product Brief: docs/product-brief-ibe160-2025-11-16.md
  {{/if}}
  {{#if domain_brief_path}}
- Domain Brief: {{domain_brief_path}}
  {{/if}}
  - Research:
  - proposal.md
  - docs/brainstorming-session-results-2025-10-26.md
  - docs/brainstorming-session-results-2025-11-08.md
  - docs/brainstorming-session-results-lørdag 8. november 2025.md
  - docs/research-technical-lørdag 8. november 2025.md
  {{/if}}

---

## Next Steps

1. **Epic & Story Breakdown** - Run: `workflow epics-stories`
2. **UX Design** (if UI) - Run: `workflow ux-design`
3. **Architecture** - Run: `workflow create-architecture`

---

_This PRD captures the essence of ibe160 - the ability to play with friends remotely, overcoming the physical limitations of the classic game._

_Created through collaborative discovery between BIP and AI facilitator._
